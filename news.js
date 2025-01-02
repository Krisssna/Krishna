// Define API URLs for different RSS-to-JSON services
const apis = [
"https://rss-to-json-serverless-api.vercel.app/api?feed_url=",
    "https://api.rss2json.com/v1/api.json?rss_url=",
    "https://api.rss-json.com/v1/?rss_url=",
     "https://rss-parser-server.vercel.app/api?url="
];

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
let currentAPIIndex = 0;
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
function fetchNews(feedUrl, retryCount = 0) {
    // Cap the number of retries to prevent infinite loops
    if (retryCount >= apis.length) {
        console.error("All APIs failed for URL:", feedUrl);
        return;
    }

    let apiUrl = apis[currentAPIIndex] + encodeURIComponent(feedUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle data from different APIs
            let items = data.items || data.feed.items || data.articles || [];

            // Normalize data structure for consistency
            let normalizedItems = items.map(item => ({
                title: item.title,
                link: item.link || item.url,
                description: item.content_html || item.description || item.summary || 'No description available',
                pubDate: item.pubDate || item.date_published || item.published_at
            }));

            allItems = allItems.concat(normalizedItems);

            // Check if all URLs have been processed
            if (allItems.length >= userFeedURLs.length) {
                displayFeedItems();
            }
        })
        .catch(error => {
            console.error("Error fetching from " + apis[currentAPIIndex], error);
            currentAPIIndex = (currentAPIIndex + 1) % apis.length; // Move to next API
            fetchNews(feedUrl, retryCount + 1); // Retry with the next API
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