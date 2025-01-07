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

        function performSearch(id) {
            const query1 = document.getElementById('searchBox1').value;
            const query2 = document.getElementById('searchBox2').value;
            if (!query1 && query2) {
                alert("Please enter a query in at least one search box.");
        return;
                // Add your search functionality here
            }   const searchURL1 = `https://cse.google.com/cse?cx=${searchId}&q=${encodeURIComponent(query)}&gsc.q=${encodeURIComponent(query)}&gsc.sort=date`;
    const searchURL2 = `https://cse.google.com/cse?cx=${search1Id}&q=${encodeURIComponent(query)}&gsc.q=${encodeURIComponent(query)}&gsc.sort=date`;

    // Open search results in new tabs
    if (query1) window.open(searchURL1, '_blank');
    if (query2) window.open(searchURL2, '_blank');
        }
