
const BASE_URL = "https://api.tvmaze.com";
const showGrid = document.getElementById("show-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("show-search-input");

/**
 * @param {Object} show 
 * @returns {HTMLElement} 
 */
const createShowCard = (show) => {
    const card = document.createElement("article");
    card.classList.add("show-card");
    
    
    const imageURL = show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';

    const summaryText = show.summary
        ? show.summary.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
        : 'No summary available.';
    
    const rating = show.rating.average || 'N/A';
    const genres = show.genres.join(', ') || 'N/A';
    
    card.innerHTML = `
        <img class="show-image" src="${imageURL}" alt="Poster of ${show.name}">
        <div class="show-info">
            <h2 class="show-name">${show.name}</h2>
            <p class="show-rating">⭐ Rating: ${rating}</p>
            <p class="show-genres">🏷️ Genres: ${genres}</p>
            <p class="show-summary">${summaryText}</p>
            <button class="details-button">View Details</button>
        </div>
    `;

    
    const detailsButton = card.querySelector('.details-button');
    detailsButton.addEventListener("click", () => {
        alert(`Name: ${show.name}\n\nFull Summary:\n${show.summary.replace(/<[^>]*>?/gm, '')}\n\nStatus: ${show.status}`);
        
    });

    return card;
};

/**
 * @param {Array<Object>} shows 
 * @param {string} title 
 */
const renderShows = (shows) => {
    showGrid.innerHTML = ""; 
    
    if (shows.length === 0) {
        showGrid.innerHTML = "<p>No results found. Try a different search term.</p>";
        return;
    }

    shows.forEach(item => {
        
        const show = item.show || item; 
        
        if (show.id) {
            showGrid.appendChild(createShowCard(show));
        }
    });
};


const loadFeaturedShows = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/shows?page=0`);
        const featured = response.data.slice(0, 30); 
        renderShows(featured);
    } catch (error) {
        showGrid.innerHTML = "<p>Error fetching featured shows. The TVmaze API might be unavailable.</p>";
        console.error("Error loading featured shows:", error);
    }
};

const searchShows = async (query) => {
    if (!query) return;
    showGrid.innerHTML = "<h2>Loading results...</h2>";

    try {
        const response = await axios.get(`${BASE_URL}/search/shows?q=${query}`);
        renderShows(response.data);
    } catch (error) {
        showGrid.innerHTML = `<p>Error searching for "${query}". Please check your connection.</p>`;
        console.error("Error searching shows:", error);
    }
};

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchShows(query);
    } else {
        alert("Please enter a show or movie title to search.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedShows();
});