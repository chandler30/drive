const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Asegúrate de tener instalada esta dependencia: npm install node-fetch

async function getMovieOrTVShowDetailsById(mediaId) {
    const apiKey = "242e044e9ed025098133698da4df3b87";
    const language = "es";

    const baseUrl = `https://api.themoviedb.org/3/tv/${mediaId}`;
    const url = new URL(baseUrl);
    url.searchParams.append("api_key", apiKey);
    url.searchParams.append("language", language);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

async function fetchAndDisplayPoster(mediaId) {
    const folderPath = './series';
    const tvId = mediaId.split('.')[0];

    try {
        console.log("Fetching details for media ID:", tvId);
        const tvDetails = await getMovieOrTVShowDetailsById(tvId, 'tv');
        console.log("Details fetched successfully:", tvDetails);
        const posterPath = `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`;

        const poster = document.createElement('img');
        poster.src = posterPath;
        poster.alt = tvDetails.name;

        const posterContainer = document.getElementById('poster-container');
        posterContainer.appendChild(poster);

        // Construir la ruta del archivo HTML solo con el ID
        const filePath = `${folderPath}/${mediaId}`;
        
        // Agregar evento click al póster para abrir el archivo HTML
        poster.addEventListener('click', () => {
            window.open(filePath, '_blank');
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchAndDisplayPostersFromFolder(folderPath) {
    try {
        const files = await fs.promises.readdir(folderPath);

        const mediaIds = files.filter(file => file.endsWith('.html'));

        for (const mediaId of mediaIds) {
            console.log("Fetching details for media ID:", mediaId);
            await fetchAndDisplayPoster(mediaId);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

const seriesFolderPath = './series'; // Ruta del directorio de series
fetchAndDisplayPostersFromFolder(seriesFolderPath);
