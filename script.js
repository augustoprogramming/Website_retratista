// ── SETUP ──
var grid    = document.querySelector('.portfolio-grid');
var isMobile = window.innerWidth <= 700;

// ── MOBILE: CSS grid puro, sem Masonry ──
if (isMobile) {
    Array.from(grid.querySelectorAll('img')).forEach(function(img) {
        img.classList.add('img-loaded');
    });
    grid.classList.add('loaded');

// ── DESKTOP: Masonry centralizado ──
} else {
    var msnry = new Masonry(grid, {
        itemSelector: 'img',
        columnWidth: 'img',
        gutter: 8,
        fitWidth: true,
        transitionDuration: '0.2s',
        stagger: 0
    });

    grid.classList.add('loaded');

    // Centraliza calculando o padding-left necessário
    function centerMasonry() {
        // Masonry seta largura no próprio elemento quando fitWidth:true
        var msnryW = parseInt(grid.style.width || 0, 10);
        if (!msnryW) return;
        var containerW = grid.parentElement
            ? grid.parentElement.offsetWidth
            : window.innerWidth;
        var pad = Math.max(0, Math.floor((containerW - msnryW) / 2));
        grid.style.marginLeft  = pad + 'px';
        grid.style.marginRight = pad + 'px';
    }

    imagesLoaded(grid).on('progress', function(instance, image) {
        image.img.classList.add('img-loaded');
        msnry.layout();
        centerMasonry();
    });

    imagesLoaded(grid, function() {
        msnry.layout();
        centerMasonry();
    });
}


// ── MODAL ──
var modal    = document.getElementById('gallery-modal');
var modalImg = document.getElementById('modal-img');
var imgs     = Array.from(document.querySelectorAll('.portfolio-grid img'));
var current  = 0;
var isAnimating = false;

var preloaded = imgs.map(function(img) {
    var i = new Image();
    i.src = img.src;
    return i;
});

function openModal(index) {
    current = index;
    modalImg.src = preloaded[current].src;
    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
}

function changeImage(newIndex) {
    if (isAnimating) return;
    isAnimating = true;
    modalImg.style.opacity = 0;
    setTimeout(function() {
        current = newIndex;
        modalImg.src = preloaded[current].src;
        modalImg.style.opacity = 1;
        isAnimating = false;
    }, 150);
}

function showNext() { changeImage((current + 1) % imgs.length); }
function showPrev() { changeImage((current - 1 + imgs.length) % imgs.length); }

imgs.forEach(function(img, i) {
    img.addEventListener('click', function() { openModal(i); });
});

document.querySelector('.close').addEventListener('click', closeModal);
document.querySelector('.next').addEventListener('click', showNext);
document.querySelector('.prev').addEventListener('click', showPrev);

modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'Escape')     closeModal();
});

var startX = 0;
modal.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; });
modal.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? showNext() : showPrev(); }
});