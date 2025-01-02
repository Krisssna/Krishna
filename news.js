let rss2jsonAPI = "https://api.rss2json.com/v1/api.json?rss_url=";
let feed2jsonAPI = "https://www.toptal.com/developers/feed2json/convert?url=";
let feedURL = "https://www.google.com/alerts/feeds/06313983183609550648/16533116384737951623";

function fetchRSS() {
    // Try with rss2json first
    fetch(rss2jsonAPI + encodeURIComponent(feedURL))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for rss2json');
            }
            return response.json();
        })
        .then(data => {
            if (data.status !== 'ok') {
                throw new Error(data.message);
            }
            displayFeedItems(data.items, 'rss2json');
        })
        .catch(error => {
            console.error("rss2json API failed:", error);
            // If rss2json fails, try feed2json
            return fetch(feed2jsonAPI + encodeURIComponent(feedURL))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok for feed2json');
                    }
                    return response.json();
                })
                .then(data => {
                    displayFeedItems(data.items, 'feed2json');
                })
                .catch(error => {
                    console.error("feed2json API failed:", error);
                    handleError('Both APIs failed to load the news.');
                });
        });
}

function displayFeedItems(items, apiUsed) {
    let html = '';
    items.forEach(item => {
        // Adjusting for the differences between rss2json and feed2json data structures
        let title, link, description, pubDate;
        if (apiUsed === 'rss2json') {
            title = item.title;
            link = item.link;
            description = item.description;
            pubDate = item.pubDate;
        } else if (apiUsed === 'feed2json') {
            title = item.title;
            link = item.url;
            description = item.content_text || item.content_html || '';
            pubDate = item.date_published;
        }

        html += `
            <div class="feed-item">
                <h3 class="feed-title"><a href="${link}" target="_blank">${title}</a></h3>
                <p class="feed-description">${description}</p>
                <p class="feed-date">${new Date(pubDate).toLocaleString()}</p>
            </div>
        `;
    });
    document.getElementById('rss-feed-content').innerHTML = html;
    document.getElementById('error-message').style.display = 'none';
}

function handleError(message) {
    document.getElementById('rss-feed-content').innerHTML = '';
    document.getElementById('error-message').innerHTML = message;
    document.getElementById('error-message').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", fetchRSS);
