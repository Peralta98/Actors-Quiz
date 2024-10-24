import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const API_KEY = '5c7bf274f9158223a057919274236e59';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

async function updateHalleBerryImage() {
  const actorId = 4587; // Halle Berry's correct ID
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&append_to_response=images`
    );
    const data = response.data;
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.profile_path) {
      const imageUrl = `${IMAGE_BASE_URL}${data.profile_path}`;
      const imagePath = path.join(OUTPUT_DIR, `${actorId}.jpg`);
      
      console.log('Image URL:', imageUrl);
      
      // Download the correct image
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'arraybuffer'
      });
      
      await fs.writeFile(imagePath, imageResponse.data);
      console.log(`Updated image for Halle Berry (ID: ${actorId})`);
    } else {
      console.log(`No profile_path found for Halle Berry (ID: ${actorId})`);
    }
  } catch (error) {
    console.error(`Error updating image for Halle Berry (ID: ${actorId}):`, error.message);
  }
}

updateHalleBerryImage().catch(console.error);
