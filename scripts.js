document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar");

    function animateProgressBars() {
        progressBars.forEach(bar => {
            let value = bar.getAttribute("aria-valuenow");
            bar.style.width = value + "%";
        });
    }

    const skillsSection = document.querySelector("#skills");
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateProgressBars();
            observer.unobserve(skillsSection);
        }
    }, { threshold: 0.5 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

   
    function toggleMenu() {
        const menu = document.getElementById("menu");
        menu.classList.toggle("active"); 
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleMenu);


    document.querySelectorAll(".dropdown").forEach(item => {
        item.addEventListener("click", function (event) {
            if (window.innerWidth <= 768) {
                event.stopPropagation(); 
                this.classList.toggle("open-dropdown"); 
            }
        });
    });

 
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("footer").scrollIntoView({ behavior: "smooth" });

         
            const menu = document.getElementById("menu");
            if (menu.classList.contains("active")) {
                menu.classList.remove("active");
            }
        });
    });
});


 document.querySelectorAll('a[href="#portfolio"]').forEach(link => {
    link.addEventListener("click", function(event) {
        const menu = document.getElementById("menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    });
});

document.querySelectorAll('a[href="#tools"]').forEach(link => {
    link.addEventListener("click", function(event) {
        const menu = document.getElementById("menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    });
});

document.querySelectorAll('a[href="#about-work"]').forEach(link => {
    link.addEventListener("click", function(event) {
        const menu = document.getElementById("menu");
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });


    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } else {
    console.error('Back to Top button not found in the DOM');
  }
});
