const newsContainer = document.getElementById('news-items');
const noticesContainer = document.getElementById('notices-container');

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

                // Exclude certain words in Nepali
              //  const excludedWords = ['महोत्सब', 'उत्सव', 'प्रतियोगिता', 'प्रदर्शनी'];
               // if (!excludedWords.some(word => title.includes(word) || description.includes(word))) {
                    const card = document.createElement('div');
                    card.className = 'news-card';
                    card.innerHTML = `
                        <h3>${title}</h3>
                        <p>${description.substring(0, 500)}</p>
                    `;
                    newsContainer.appendChild(card);
                }
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
        const noticeDiv = document.createElement('div');
        noticeDiv.className = 'notice-card';
        noticeDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${notice.content}</p>
        `;
        noticesContainer.appendChild(noticeDiv);
    });
}

document.querySelector('nav ul li a[href="#news"]').addEventListener('click', function() {
    // Show the "News" section and hide the "Notices" section
    document.getElementById('news-container').style.display = 'block';
    document.getElementById('notices-container').style.display = 'none';
   // fetchNews('https://www.google.com/alerts/feeds/17248606588752154671/17646417480729972491');
   // fetchNews('https://www.google.com/alerts/feeds/06313983183609550648/13722836873792678019');
   // fetchNews('https://www.google.com/alerts/feeds/17248606588752154671/15089319890734284885');
   // fetchNews('https://www.google.com/alerts/feeds/06313983183609550648/16120492411931428893');
});

document.querySelector('nav ul li a[href="#notices"]').addEventListener('click', function() {
    // Show the "Notices" section and hide the "News" section
    document.getElementById('notices-container').style.display = 'block';
    document.getElementById('news-container').style.display = 'none';
    displayNotices();
});
