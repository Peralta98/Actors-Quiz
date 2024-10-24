import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const API_KEY = '5c7bf274f9158223a057919274236e59';
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images');
const JSON_PATH = path.join(process.cwd(), 'src', 'data', 'actors.json');

async function getActorDetails(actorId) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for actor ${actorId}:`, error.message);
    return null;
  }
}

async function syncActorsJsonWithImages() {
  try {
    // Read the current actors.json file
    const actorsJsonRaw = await fs.readFile(JSON_PATH, 'utf-8');
    const actorsData = JSON.parse(actorsJsonRaw);
    const actorsMap = new Map(actorsData.actors.map(actor => [actor.id, actor]));

    // Get all image files
    const imageFiles = await fs.readdir(IMAGE_DIR);

    for (const file of imageFiles) {
      if (file.endsWith('.jpg')) {
        const actorId = parseInt(path.basename(file, '.jpg'));
        
        if (!actorsMap.has(actorId)) {
          console.log(`Adding new actor with ID ${actorId}`);
          const actorDetails = await getActorDetails(actorId);
          
          if (actorDetails) {
            const newActor = {
              id: actorId,
              name: actorDetails.name,
              gender: actorDetails.gender === 1 ? 'female' : 'male',
              image: `/images/${file}`
            };
            actorsMap.set(actorId, newActor);
          }
        }
      }
    }

    // Update the actors.json file
    const updatedActorsData = {
      actors: Array.from(actorsMap.values())
    };

    await fs.writeFile(JSON_PATH, JSON.stringify(updatedActorsData, null, 2));
    console.log('actors.json has been updated successfully.');

  } catch (error) {
    console.error('Error syncing actors.json with images:', error);
  }
}

syncActorsJsonWithImages();
