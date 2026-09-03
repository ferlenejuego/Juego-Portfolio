const parts = [
    { id: 'navbar', file: 'html/navbar.html', placeholder: '<div id="navbarMount"></div>' },
    { id: 'home', file: 'html/home.html', placeholder: '<section id="homeMount" class="slide"></section>' },
    { id: 'about', file: 'html/about.html', placeholder: '<section id="aboutMount" class="slide"></section>' },
    { id: 'activities', file: 'html/activities.html', placeholder: '<section id="activitiesMount" class="slide"></section>' },
    { id: 'quizzes', file: 'html/quizzes.html', placeholder: '<section id="quizzesMount" class="slide"></section>' },
    { id: 'laboratory', file: 'html/laboratory.html', placeholder: '<section id="laboratoryMount" class="slide"></section>' },
    { id: 'exams', file: 'html/exams.html', placeholder: '<section id="examsMount" class="slide"></section>' },
    { id: 'projects', file: 'html/projects.html', placeholder: '<section id="projectsMount" class="slide"></section>' },
    { id: 'footer', file: 'html/footer.html', placeholder: '<div id="footerMount"></div>' }
];

function loadPart(part) {
    return fetch(part.file)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to load ' + part.file);
            }
            return response.text();
        })
        .then(function(html) {
            const mount = document.getElementById(part.id + 'Mount');
            if (mount) {
                mount.outerHTML = html.trim();
            }
        });
}

Promise.all(parts.map(loadPart))
    .then(function() {
        initPortfolio();
    })
    .catch(function(err) {
        console.error('Portfolio include load error:', err);
    });

function initPortfolio() {
    if (window.initMain) {
        window.initMain();
    }
    if (window.initCursor) {
        window.initCursor();
    }
    if (window.initHome) {
        window.initHome();
    }
}
window.initPortfolio = initPortfolio;
