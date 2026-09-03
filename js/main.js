function initMain() {
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');

    const slideIds = ['home', 'about', 'activities', 'quizzes', 'laboratory', 'exams', 'projects'];

    let currentSlide = 'home';

    function goToSection(id) {
        if (!id || id === currentSlide) {
            return;
        }
        currentSlide = id;
        slides.forEach(function(slide) {
            slide.classList.remove('active');
            if (slide.id === id) {
                slide.classList.add('active');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
            }
        });
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            goToSection(target);
        });
    });

    document.querySelectorAll('.hero-buttons a').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = button.getAttribute('href').substring(1);
            goToSection(target);
        });
    });

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    window.addEventListener('keydown', function(e) {
        const index = slideIds.indexOf(currentSlide);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (index < slideIds.length - 1) {
                goToSection(slideIds[index + 1]);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (index > 0) {
                goToSection(slideIds[index - 1]);
            }
        } else if (e.key === 'Home') {
            goToSection('home');
        }
    });
}
window.initMain = initMain;
