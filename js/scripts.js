document.addEventListener("DOMContentLoaded", function () {
    const newsLink = document.querySelector('nav ul li a[href="#news"]');
    const newsSection = document.getElementById('news');
    const newsContent = document.getElementById('news-content');

    // Terms to filter out
    const excludeTerms = ["पार्टीको संरचना", "राशिफल", "हवाइजहाज", "दिवस"];

    // URLs to fetch news from
    const urls = [
        'https://0kisn.blogspot.com/p/blog-page_19.html',
        'https://0kisn.blogspot.com/p/blog-page_45.html',
        'https://0kisn.blogspot.com/p/blog-page_8.html',
        'https://0kisn.blogspot.com/p/blog-page_85.html'
    ];

    // Function to fetch and filter news
    async function fetchAndFilterNews() {
        let allArticles = '';

        for (const url of urls) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                // Select the articles from the fetched content
                const articles = doc.querySelectorAll('article'); // Adjust this selector based on the structure of the blog pages

                articles.forEach(article => {
                    const articleText = article.textContent;
                    // Check if the article contains any excluded terms
                    const containsExcludedTerms = excludeTerms.some(term => articleText.includes(term));
                    
                    if (!containsExcludedTerms) {
                        allArticles += `<div class="news-card">${article.innerHTML}</div>`;
                    }
                });
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }

        // Display the filtered news articles
        newsContent.innerHTML = allArticles ? allArticles : '<p>No relevant news found.</p>';
    }

    // Load news on clicking the news link
    newsLink.addEventListener('click', function (event) {
        event.preventDefault();
        fetchAndFilterNews();
        newsSection.scrollIntoView({ behavior: 'smooth' });
    });
});
