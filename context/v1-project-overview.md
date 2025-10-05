Let me quickly inspect the existing backend under `apps/api` to align the requirements and propose concrete API routes.

[3 tools called]

### UGC AI Video — Dev‑Ready Requirements (Backend = `apps/api` Express)

- **Goal**: Users create many short UGC “talking actor” videos per project. Input is text or ≤60s audio. We generate TTS with fal.ai, optionally edit the actor image with fal.ai “nano‑bana” image mode based on a prompt, then lip‑sync video with wavespeed InfiniteTalk. All assets + metadata saved and shown per project.

---

### 1) User Stories (MVP)

- **Create project**

  - I can create a project with a title and see it in my dashboard.

- **Select actor**

  - I can pick one actor from a catalog of 10 at launch. Actor includes a base image and a bound voice.

- **Image edit (nano‑bana)**

  - I can edit the selected actor’s image by entering a prompt like “in a bathroom,” “at the beach,” or “outdoor setting.” The system generates a new image variant that I can reuse for future videos in this project.

- **Generate video from text**

  - I paste a script (≤1500 chars/≤60s), select an actor and optional image variant (or enter an image‑edit prompt inline), click Generate, and get a talking video.

- **Generate video from audio**

  - I upload ≤60s audio (.mp3/.wav ≤10MB), pick actor + optional image variant or prompt, click Generate, and get a talking video.

- **Browse & filter actors**

  - I can filter actors by age range, gender, and scene tags (airport, bathroom, cooking, beach, card, general).

- **Project gallery**
  - I see all generated videos in a grid with status, duration, actor, and image variant used. I can download, copy link, regenerate, or delete.

---

### 2) System Architecture

- **Frontend**: Next.js app consumes REST from `apps/api` Express server.
- **Backend**: `apps/api` (Express). All routes under `/api/*`.
- **DB**: Postgres (Supabase). ORM: Drizzle. RLS enforced (owner + invited members).
- **Storage**: Supabase Storage buckets: `ugc-images/`, `ugc-audio/`, `ugc-video/`.
- **Queue/Workers**: Background jobs for generation. Use BullMQ (Redis) or Inngest/QStash. Polling fallback.
- **Events**: Job updates via SSE.

---

### 3) Data Model (SQL)

```sql
-- projects
create table if not exists project (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- actors (seed 10)
create table if not exists actor_model (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,              -- slug: "ava_beach_01"
  display_name text not null,
  image_url text not null,               -- base image for lip-sync and image-edit source
  voice_provider text not null default 'fal.ai',
  voice_id text not null,                -- provider voice id
  age_range text,
  gender text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- image variants (generated via nano-bana; scoped to project)
create table if not exists actor_image_variant (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  actor_id uuid not null references actor_model(id) on delete cascade,
  prompt text not null,                  -- e.g., "in a bathroom", "outdoor daytime"
  seed bigint,
  strength real,                         -- 0..1 if supported
  output_image_url text not null,
  meta jsonb not null default '{}'::jsonb, -- provider payloads
  created_at timestamptz not null default now()
);

-- videos (one per generation)
create table if not exists video_asset (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  actor_id uuid not null references actor_model(id),
  image_variant_id uuid references actor_image_variant(id), -- optional
  source_type text not null check (source_type in ('text','audio')),
  source_text text,
  source_audio_url text,
  video_url text,
  duration_seconds int,
  status text not null check (status in ('queued','generating','completed','failed')),
  error text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- jobs (pipeline tracking)
create table if not exists generation_job (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references video_asset(id) on delete cascade,
  step text not null check (step in ('init','image_edit','tts','lip_sync','finalize')),
  status text not null check (status in ('queued','running','completed','failed')),
  provider text,  -- 'fal.ai' | 'wavespeed'
  request jsonb,
  response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

RLS: owner read/write; invited team read. Writes to `status`/`meta` via service role only.

---

### 4) API (Express, `apps/api`)

- POST `/api/projects`

  - Body: `{ title: string }`
  - 201: `{ id, title }`

- GET `/api/projects/:projectId/videos`

  - Query: `?page, pageSize, status?`
  - 200: `{ items: Video[], nextCursor? }`

- POST `/api/projects/:projectId/image-variants` // nano‑bana edit

  - Body: `{ actorKey: string; prompt: string; seed?: number; strength?: number }`
  - Creates an edited image via fal.ai “nano‑bana”; stores `actor_image_variant`.
  - 202: `{ imageVariantId, status: 'queued' }` if async; 201 with record if sync.

- GET `/api/projects/:projectId/image-variants`

  - Query: `?actorKey=...`
  - 200: `{ items: ImageVariant[] }`

- POST `/api/projects/:projectId/videos`

  - Body (one of):
    - Text: `{ actorKey: string; script: string; imageVariantId?: string; imageEditPrompt?: string }`
    - Audio: `{ actorKey: string; audioUploadId: string; imageVariantId?: string; imageEditPrompt?: string }`
  - Behavior:
    - If `imageVariantId` → use that image.
    - Else if `imageEditPrompt` → run nano‑bana on the actor base image to create a project‑scoped variant, then continue.
    - If text → TTS with actor’s bound voice (fal.ai).
    - Then lip‑sync with wavespeed InfiniteTalk.
  - 202: `{ videoId, jobId, status: 'queued' }`

- GET `/api/jobs/:jobId`

  - 200: `{ jobId, status, step, progress, videoId }`

- GET `/api/projects/:projectId/videos/:videoId/stream` (SSE)

  - Emits `status`, `step`, `progress`, `error`, `completed`.

- DELETE `/api/videos/:videoId`
  - 204

Types:

```ts
type VideoStatus = 'queued' | 'generating' | 'completed' | 'failed'
type JobStatus = 'queued' | 'running' | 'completed' | 'failed'
```

---

### 5) External Integrations

- **fal.ai — TTS**

  - Input: `{ text, voice_id, format: 'mp3', sample_rate: 44100 }`
  - Output: `{ audio_url, duration }`
  - Retry on 429/5xx with backoff; 30s timeout. Upload audio to `ugc-audio/`.

- **fal.ai — nano‑bana image edit (speculative API name)**

  - Input: `{ image_url: actor.image_url, prompt, seed?, strength? }`
  - Output: `{ output_image_url }`
  - Save as `actor_image_variant` (scoped to project). Upload to `ugc-images/variants/`.
  - Note: confirm exact model/endpoint name and parameter names in fal.ai docs; wire via provider config.

- **wavespeed InfiniteTalk — lip‑sync**
  - Endpoint: `https://wavespeed.ai/models/wavespeed-ai/infinitetalk`
  - Input: `{ audio_url, image_url, fps?: 25, seed? }`
  - Output: `{ video_url, duration, thumb_url }`
  - Poll every 2–5s up to 10 minutes or use webhook if available.

---

### 6) Pipeline Logic

- Steps: `init` → `image_edit?` → `tts?` → `lip_sync` → `finalize`
- Concurrency: max 2 active generations per user; others queued.
- On completion: upload final video to `ugc-video/`, update DB, emit SSE.

---

### 7) Validation & Limits

- Text: ≤1500 chars; estimate time (150 wpm) to keep ≤60s.
- Audio: ≤60s, .mp3/.wav, ≤10MB; transcode to 44.1kHz mono mp3.
- Image edit: prompt ≤200 chars; strength in [0,1].
- Rate: 30 generations/day/user (configurable).

---

### 8) Errors & Retries

- Envelope: `{ code, message, details? }`
- Retries:
  - fal.ai (TTS / nano‑bana) 429/5xx → up to 2 retries (jittered backoff).
  - wavespeed polling timeout 10 minutes.
- Failure marks `video_asset.status='failed'` with `error` and `meta`.

---

### 9) UI/UX

- Composer on project page:
  - Actor picker with filters; list of reusable image variants for that actor.
  - Toggle: “Text to Speech” | “Speech to Speech”.
  - Optional “Image prompt” field to create a new variant on the fly.
  - Generate button; Cmd+Enter shortcut.
- Grid of videos with status chips; details drawer with preview, metadata, actions.
- Voice is fixed per actor across projects.

---

### 10) Metrics

- Per user: started/completed, avg TTS time, avg image‑edit time, avg lip‑sync time, fail rate.
- Per provider: error codes, retries.
- Cost: store provider usage in `meta.cost`.

---

### 11) Security

- API keys only on server; never to client.
- All storage private; signed URLs for download.
- RLS for tables; jobs updated by service role.
- Simple content guard to block disallowed prompts (MVP).

---

### 12) Example Requests

```http
POST /api/projects/:projectId/image-variants
Content-Type: application/json

{ "actorKey": "ava_base_01", "prompt": "in a bathroom, warm lighting", "strength": 0.6 }
```

```json
// 202
{ "imageVariantId": "6e2b...", "status": "queued" }
```

```http
POST /api/projects/:projectId/videos
Content-Type: application/json

{
  "actorKey": "ava_base_01",
  "script": "Okay, so I've been seeing this Kylie Cosmetics...",
  "imageEditPrompt": "beach at golden hour"
}
```

```json
// 202
{ "videoId": "e3b7...", "jobId": "b91f...", "status": "queued" }
```

---

### 13) Deliverables (tickets)

- DB migrations and Drizzle models for `project`, `actor_model`, `actor_image_variant`, `video_asset`, `generation_job`.
- Seed 10 actors; upload base images; map `voice_id`.
- Storage buckets and signed URL helpers.
- Express routes above with validation (Zod).
- Worker(s): image‑edit (nano‑bana) → TTS → InfiniteTalk; uploads + DB updates.
- SSE endpoint for live progress.
- Rate limiting + concurrency guard.
- UI: actor catalog + filters; composer with image prompt and variant picker; project grid + details.
- Analytics logging.

---

Open items to confirm before build:

- Exact fal.ai nano‑bana endpoint/params; ability to set `strength/seed`.
- wavespeed webhook availability.
- Hard delete vs soft delete for videos; default hard delete.

- Added: Express backend `apps/api` replaces Next.js API; added image edit via fal.ai nano‑bana with prompt; added `actor_image_variant` table and routes to create/list variants; pipeline updated to include `image_edit`.
