import { Webhooks } from '@dodopayments/nextjs'
import { db } from '@/lib/db/drizzle'
import { teams } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function upsertTeam(payload: any) {
  const data = payload?.data ?? {}

  // Try to get team ID from either reference or metadata
  const teamIdFromRef =
    data.reference && /^\d+$/.test(String(data.reference))
      ? Number(data.reference)
      : null

  const teamIdFromMeta =
    data?.metadata?.team_id && /^\d+$/.test(String(data.metadata.team_id))
      ? Number(data.metadata.team_id)
      : null

  const dodoCustomerId: string | null = data.customer_id ?? null

  const update: any = {
    dodoCustomerId,
    dodoSubscriptionId: data.subscription_id ?? null,
    dodoProductId: data.product_id ?? null,
    planName: data.plan_name ?? null,
    subscriptionStatus: data.status ?? null,
    updatedAt: new Date(),
  }

  // Update team by ID (from reference or metadata) or by customer ID
  if (teamIdFromRef ?? teamIdFromMeta) {
    await db.update(teams).set(update).where(eq(teams.id, (teamIdFromRef ?? teamIdFromMeta)!))
  } else if (dodoCustomerId) {
    await db.update(teams).set(update).where(eq(teams.dodoCustomerId, dodoCustomerId))
  }
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET || '',
  onPayload: async (payload) => {
    // Log for debugging if needed
    console.log('Dodo webhook received:', payload.type)
  },

  onPaymentSucceeded: upsertTeam,
  onPaymentFailed: upsertTeam,
  onPaymentProcessing: async () => {},

  onSubscriptionActive: upsertTeam,
  onSubscriptionRenewed: upsertTeam,
  onSubscriptionPlanChanged: upsertTeam,
  onSubscriptionCancelled: upsertTeam,
  onSubscriptionFailed: upsertTeam,
  onSubscriptionExpired: upsertTeam,
})