import fs from 'fs';
import path from 'path';
import https from 'https';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import actorsData from '../src/data/actors.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... resto do código permanece inalterado ...

const API_KEY = '5c7bf274f9158223a057919274236e59';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');

// Certifique-se de que o diretório de saída existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(`Failed to download image: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Error: ${err.message}`);
    });
  });
}

async function fetchActorImage(actor) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${API_KEY}`
    );
    const data = await response.json();
    if (data.profiles && data.profiles.length > 0) {
      const imageUrl = `${IMAGE_BASE_URL}${data.profiles[0].file_path}`;
      const imagePath = path.join(OUTPUT_DIR, `${actor.id}.jpg`);
      await downloadImage(imageUrl, imagePath);
      console.log(`Downloaded image for ${actor.name}`);
    } else {
      console.log(`No image found for ${actor.name}`);
    }
  } catch (error) {
    console.error(`Error fetching image for ${actor.name}:`, error);
  }
}

async function main() {
  for (const actor of actorsData.actors) {
    await fetchActorImage(actor);
  }
  console.log('All images downloaded');
}

main();
