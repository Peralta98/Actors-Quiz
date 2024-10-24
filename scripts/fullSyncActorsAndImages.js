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

async function fullSyncActorsAndImages() {
  try {
    // Read the current actors.json file
    const actorsJsonRaw = await fs.readFile(JSON_PATH, 'utf-8');
    const actorsData = JSON.parse(actorsJsonRaw);
    let actorsMap = new Map(actorsData.actors.map(actor => [actor.id, actor]));

    // Get all image files
    const imageFiles = await fs.readdir(IMAGE_DIR);
    const imageIds = new Set(imageFiles.map(file => parseInt(path.basename(file, '.jpg'))));

    // Remove actors without images
    for (const [id, actor] of actorsMap) {
      if (!imageIds.has(id)) {
        console.log(`Removing actor without image: ${actor.name} (ID: ${id})`);
        actorsMap.delete(id);
      }
    }

    // Add actors with images but not in JSON
    for (const id of imageIds) {
      if (!actorsMap.has(id)) {
        console.log(`Adding new actor with ID ${id}`);
        const actorDetails = await getActorDetails(id);
        
        if (actorDetails) {
          const newActor = {
            id: id,
            name: actorDetails.name,
            gender: actorDetails.gender === 1 ? 'female' : 'male',
            image: `/images/${id}.jpg`
          };
          actorsMap.set(id, newActor);
        } else {
          console.log(`Could not fetch details for actor ID ${id}, skipping`);
        }
      }
    }

    // Update the actors.json file
    const updatedActorsData = {
      actors: Array.from(actorsMap.values())
    };

    await fs.writeFile(JSON_PATH, JSON.stringify(updatedActorsData, null, 2));
    console.log('actors.json has been fully synchronized with images.');

    // Log the final count
    console.log(`Total actors in JSON: ${updatedActorsData.actors.length}`);
    console.log(`Total images: ${imageFiles.length}`);

  } catch (error) {
    console.error('Error during full sync of actors and images:', error);
  }
}

fullSyncActorsAndImages();
