const { readFileSync } = require('fs');
const { join } = require('path');

// Load actor data
const actorsData = JSON.parse(readFileSync(join(__dirname, 'actors.json'), 'utf8'));

// Generate SQL INSERT statements
const generateSQL = () => {
  const values = actorsData.map(actor => {
    const tags = `{${actor.tags.map(tag => `"${tag}"`).join(',')}}`;
    return `('${actor.key}', '${actor.display_name}', '${actor.image_url}', '${actor.voice_provider}', '${actor.voice_id}', '${actor.age_range}', '${actor.gender}', '${tags}')`;
  }).join(',\n  ');

  return `
INSERT INTO actor_model (key, display_name, image_url, voice_provider, voice_id, age_range, gender, tags) 
VALUES
  ${values};
`;
};

console.log(generateSQL());