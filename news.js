// Define two API URLs for rss2json and feed2json
let rss2jsonAPI = "https://api.rss2json.com/v1/api.json?rss_url=";
let feed2jsonAPI = "https://www.toptal.com/developers/feed2json/convert?url=";

// Define a mapping of RSS feed URLs for each category
const feedURLs = {
    'construction-news': [
        'https://www.google.com/alerts/feeds/06313983183609550648/1325310956997533878'
    ],
    // Add other categories here if needed
};

// Define publisher names based on domain
const publisherNames = {
    'google.com': 'Google Alerts'
};

// Determine the category from the URL hash
let category = window.location.hash.substring(1) || 'construction-news'; // Default to 'construction-news'
let userFeedURLs = feedURLs[category] || [];

// Error handling if no feeds exist for the category
if (userFeedURLs.length === 0) {
    alert('No feeds for this category');
}

// Variables to manage API fallback
let rss2jsonLimitReached = false;
let currentAPI = rss2jsonAPI;

// Array to hold all fetched items
let allItems = [];

// Function to extract domain from URL
function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        console.error('Invalid URL:', url);
        return '';
    }
}

// Function to fetch news from the current API
function fetchNews(feedUrl) {
    let apiUrl = currentAPI + encodeURIComponent(feedUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle data from either API (rss2json or feed2json)
            let items = data.items || data.feed.items; // feed2json uses 'feed.items'
            allItems = allItems.concat(items.map(item => ({
                title: item.title,
                link: item.link || item.url, // rss2json uses 'link', feed2json uses 'url'
                description: item.content_html || item.description || item.summary || 'No description available',
                pubDate: item.pubDate || item.date_published,
            })));
            // Check if all URLs have been processed
            if (allItems.length >= userFeedURLs.length) {
                displayFeedItems();
            }
        })
        .catch(error => {
            console.error("Error fetching from " + currentAPI, error);
            if (!rss2jsonLimitReached && currentAPI === rss2jsonAPI) {
                console.log("rss2json API limit reached. Switching to feed2json.");
                rss2jsonLimitReached = true;
                currentAPI = feed2jsonAPI;
                // Retry fetching using feed2json for all URLs
                userFeedURLs.forEach(feedUrl => fetchNews(feedUrl));
            }
        });
}

// Function to display feed items
function displayFeedItems() {
    // Sort items by published date in descending order (newest first)
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    let html = '';
    allItems.forEach(item => {
        let domain = getDomainFromUrl(item.link);
        let publisher = publisherNames[domain] || 'Unknown';

        html += `
            <div class="feed-item">
                <h3 class="feed-title"><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p class="feed-description">${item.description}</p>
                <p class="feed-date">Published Date: ${new Date(item.pubDate).toLocaleString()}</p>
                <p class="feed-publisher">Publisher: ${publisher}</p>
            </div>
        `;
    });

    document.getElementById('rss-feed-content').innerHTML = html;
    document.getElementById('error-message').style.display = 'none';
}

// Fetch news for each feed URL
userFeedURLs.forEach(userUrl => {
    fetchNews(userUrl);
});
