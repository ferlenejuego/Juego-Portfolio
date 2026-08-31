function initCursor() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (!cursorDot || !cursorRing) {
        return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function(e) {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }

    animateRing();

    document.querySelectorAll('a, button, label, .card').forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursorRing.classList.add('hover');
            cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', function() {
            cursorRing.classList.remove('hover');
            cursorDot.style.opacity = '1';
        });
    });
}
window.initCursor = initCursor;
