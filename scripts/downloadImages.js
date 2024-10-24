const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const actorsData = require('../src/data/actors.json');

const API_KEY = '5c7bf274f9158223a057919274236e59';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('finish', () => resolve())
      .on('error', e => reject(e));
  });
}

async function fetchActorImage(actor) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${API_KEY}`
    );
    const data = response.data;
    if (data.profiles && data.profiles.length > 0) {
      const imageUrl = `${IMAGE_BASE_URL}${data.profiles[0].file_path}`;
      const imagePath = path.join(OUTPUT_DIR, `${actor.id}.jpg`);
      await downloadImage(imageUrl, imagePath);
      console.log(`Downloaded image for ${actor.name}`);
    } else {
      console.log(`No image found for ${actor.name}`);
    }
  } catch (error) {
    console.error(`Error fetching image for ${actor.name}:`, error.message);
  }
}

async function main() {
  await fs.ensureDir(OUTPUT_DIR);
  for (const actor of actorsData.actors) {
    await fetchActorImage(actor);
  }
  console.log('All images downloaded');
}

main().catch(console.error);
