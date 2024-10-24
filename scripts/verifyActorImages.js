import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import actorsData from '../src/data/actors.json' assert { type: "json" };

const API_KEY = '5c7bf274f9158223a057919274236e59';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

async function verifyAndUpdateImage(actor) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actor.id}?api_key=${API_KEY}&append_to_response=images`
    );
    const data = response.data;
    
    if (data.profile_path) {
      const imageUrl = `${IMAGE_BASE_URL}${data.profile_path}`;
      const imagePath = path.join(OUTPUT_DIR, `${actor.id}.jpg`);
      
      // Download the correct image
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'arraybuffer'
      });
      
      await fs.writeFile(imagePath, imageResponse.data);
      console.log(`Updated image for ${actor.name}`);
    } else {
      console.log(`No image found for ${actor.name}`);
    }
  } catch (error) {
    console.error(`Error verifying/updating image for ${actor.name}:`, error.message);
  }
}

async function main() {
  for (const actor of actorsData.actors) {
    await verifyAndUpdateImage(actor);
  }
  console.log('All images verified and updated');
}

main().catch(console.error);
