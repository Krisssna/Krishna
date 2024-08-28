document.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.getElementById('news-container');

  function fetchNews(url) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        if (xmlDoc.getElementsByTagName('parsererror').length) {
          throw new Error('Error parsing XML');
        }
        const items = xmlDoc.getElementsByTagName('item');

        newsContainer.innerHTML = ''; // Clear previous news

        for (let i = 0; i < items.length; i++) {
          const title = items[i].getElementsByTagName('title')[0].textContent;
          const description = items[i].getElementsByTagName('description')[0].textContent;

          // Exclude certain words in Nepali
          const excludedWords = ['महोत्सब', 'उत्सव', 'प्रतियोगिता', 'प्रदर्शनी'];
          if (!excludedWords.some(word => title.includes(word) || description.includes(word))) {
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

  const urls = [
    'https://www.google.com/alerts/feeds/17248606588752154671/17646417480729972491',
    'https://www.google.com/alerts/feeds/06313983183609550648/13722836873792678019',
    'https://www.google.com/alerts/feeds/17248606588752154671/15089319890734284885',
    'https://www.google.com/alerts/feeds/06313983183609550648/16120492411931428893'
  ];

  Promise.all(urls.map(url => fetchNews(url)))
    .catch(error => console.error('Error fetching news:', error));
});
