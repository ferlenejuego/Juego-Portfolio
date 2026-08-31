function initHome() {
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1800;
        const start = Date.now();

        function update() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        update();
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(animateCounter);
}
window.initHome = initHome;
