async function fetchNews() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyp8jBa0QCCaBNc0GPDYjtlQIejSFulQUJWJ140KP1KefY8rJYbSoc4x060V6X5Fmhekw/exec');

    if (!response.ok) {
      throw new Error(`Network response was not ok (status ${response.status})`);
    }

    const data = await response.json();

    const newsContainer = document.getElementById('news');
    newsContainer.innerHTML = ''; // Clear previous content

    data.articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('article'); // Add a CSS class for styling

      articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <a href="${article.link}" target="_blank">Read more</a>
      `;

      newsContainer.appendChild(articleElement);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    // Handle error gracefully, e.g., display an error message to the user
  }
}

fetchNews();
