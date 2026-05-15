// ── MASONRY ──
var grid = document.querySelector('.portfolio-grid');

imagesLoaded(grid, function () {
    var msnry = new Masonry(grid, {
        itemSelector: 'img',
        columnWidth: 'img',
        gutter: 8,
        fitWidth: true,
        transitionDuration: '0.3s'
    });

    // MOSTRA O GRID SÓ DEPOIS QUE ESTIVER PRONTO
    grid.classList.add('loaded');
});


// ── MODAL ──
var modal    = document.getElementById('gallery-modal');
var modalImg = document.getElementById('modal-img');
var imgs     = Array.from(document.querySelectorAll('.portfolio-grid img'));

var current = 0;
var isAnimating = false; // evita spam de clique


// ── PRELOAD DAS IMAGENS ──
// carrega todas as imagens antes pra navegação ficar instantânea
var preloaded = imgs.map(img => {
    var i = new Image();
    i.src = img.src;
    return i;
});


// ── ABRIR MODAL ──
function openModal(index) {
    current = index;
    modalImg.src = preloaded[current].src;
    modal.classList.add('open');
}


// ── FECHAR MODAL ──
function closeModal() {
    modal.classList.remove('open');
}


// ── TRANSIÇÃO SUAVE ENTRE IMAGENS ──
function changeImage(newIndex) {
    if (isAnimating) return; // trava spam
    isAnimating = true;

    // fade-out
    modalImg.style.opacity = 0;

    setTimeout(function () {
        current = newIndex;
        modalImg.src = preloaded[current].src;

        // fade-in
        modalImg.style.opacity = 1;

        isAnimating = false;
    }, 150);
}


// ── PRÓXIMA / ANTERIOR ──
function showNext() {
    var nextIndex = (current + 1) % imgs.length;
    changeImage(nextIndex);
}

function showPrev() {
    var prevIndex = (current - 1 + imgs.length) % imgs.length;
    changeImage(prevIndex);
}


// ── CLICK NAS IMAGENS ──
imgs.forEach(function(img, i) {
    img.addEventListener('click', function() {
        openModal(i);
    });
});


// ── BOTÕES ──
document.querySelector('.close').addEventListener('click', closeModal);
document.querySelector('.next').addEventListener('click', showNext);
document.querySelector('.prev').addEventListener('click', showPrev);


// ── CLICK FORA (FECHAR) ──
modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});


// ── TECLADO ──
document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'Escape')     closeModal();
});


// ── SWIPE (MOBILE) ──
var startX = 0;

modal.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
});

modal.addEventListener('touchend', function(e) {
    var endX = e.changedTouches[0].clientX;
    var diff = startX - endX;

    // threshold mínimo pra considerar swipe
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            showNext(); // swipe esquerda → próxima
        } else {
            showPrev(); // swipe direita → anterior
        }
    }
});