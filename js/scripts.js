const newsContainer = document.getElementById('news-items');
const noticesContainer = document.getElementById('notice-items');

function fetchNews(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const items = xmlDoc.getElementsByTagName('item');

            newsContainer.innerHTML = ''; // Clear previous news

            if (items.length === 0) {
                console.warn('No news items found in the feed');
                return;
            }

            for (let i = 0; i < items.length; i++) {
                const title = items[i].getElementsByTagName('title')[0].textContent;
                const description = items[i].getElementsByTagName('description')[0].textContent;

                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description.substring(0, 500)}</p>
                `;
                newsContainer.appendChild(card);
            }
        })
        .catch(error => console.error('Error fetching news:', error));
}

function displayNotices() {
    const notices = [
        {
            title: "Important Announcement",
            content: "This is a sample notice."
        },
        // Add more notices here
    ];

    noticesContainer.innerHTML = ''; // Clear previous notices

    notices.forEach(notice => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <h3>${notice.title}</h3>
            <p>${notice.content}</p>
        `;
        noticesContainer.appendChild(card);
    });
}

// Initialize
fetchNews('https://news.google.com/rss/search?q=construction+Nepal&hl=en-NP&gl=NP&ceid=NP:en');
displayNotices();
