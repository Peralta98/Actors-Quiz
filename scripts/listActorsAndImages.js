import fs from 'fs/promises';
import path from 'path';

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images');
const JSON_PATH = path.join(process.cwd(), 'src', 'data', 'actors.json');

async function listActorsAndImages() {
  try {
    // Read the actors.json file
    const actorsJsonRaw = await fs.readFile(JSON_PATH, 'utf-8');
    const actorsData = JSON.parse(actorsJsonRaw);

    // Get all image files
    const imageFiles = await fs.readdir(IMAGE_DIR);

    console.log('Actors in JSON:');
    actorsData.actors.forEach(actor => {
      console.log(`ID: ${actor.id}, Name: ${actor.name}`);
    });

    console.log('\nImages in folder:');
    imageFiles.forEach(file => {
      console.log(file);
    });

    // Find mismatches
    console.log('\nActors without images:');
    actorsData.actors.forEach(actor => {
      if (!imageFiles.includes(`${actor.id}.jpg`)) {
        console.log(`ID: ${actor.id}, Name: ${actor.name}`);
      }
    });

    console.log('\nImages without actors:');
    imageFiles.forEach(file => {
      const id = path.basename(file, '.jpg');
      if (!actorsData.actors.some(actor => actor.id === parseInt(id))) {
        console.log(file);
      }
    });

  } catch (error) {
    console.error('Error listing actors and images:', error);
  }
}

listActorsAndImages();
