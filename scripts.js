function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const menuIcon = document.querySelector('.menu-icon');
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = 'none';
    }
});

document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const content = this.querySelector('.dropdown-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach((bar) => {
        const value = bar.getAttribute("aria-valuenow");
        bar.style.width = value + "%"; // Set the width based on aria-valuenow
    });
});

function showSearchBoxes() {
    const container = document.getElementById('searchBoxContainer');
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

async function performSearch(id) {
    const query1 = document.getElementById('searchBox1').value;
    const query2 = document.getElementById('searchBox2').value;

    if (!query1 && !query2) {
        alert("Please enter a query in at least one search box.");
        return;
    }

    const searchId = 'YOUR_GOOGLE_CX_ID_1';
    const search1Id = 'YOUR_GOOGLE_CX_ID_2';

    const searchURL1 = `https://cse.google.com/cse?cx=${searchId}&q=${encodeURIComponent(query1)}&gsc.q=${encodeURIComponent(query1)}&gsc.sort=date`;
    const searchURL2 = `https://cse.google.com/cse?cx=${search1Id}&q=${encodeURIComponent(query2)}&gsc.q=${encodeURIComponent(query2)}&gsc.sort=date`;

    // Open search results in new tabs
    if (query1) window.open(searchURL1, '_blank');
    if (query2) window.open(searchURL2, '_blank');

    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query1 || query2}&apiKey=YOUR_API_KEY`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById("news-results");
    const hiddenField = document.getElementById("hidden-news-ids");
    let newsIds = [];

    newsContainer.innerHTML = ""; // Clear previous results

    articles.forEach((article, index) => {
        const newsId = `news-${index}`;
        newsIds.push(newsId);

        // Create and append news item
        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.dataset.id = newsId; // Save ID in data attribute
        newsItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });

    // Secretly store news IDs in the hidden input field
    hiddenField.value = JSON.stringify(newsIds);
}
