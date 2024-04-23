// For proper rendering of tex math formulas
MathJax = {
    tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']]
    }
};

// For toggling the visibility of all the details elements
window.onload = function() {
    // Set current page active
    var navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(function (button) {
        if (button.href === window.location.href) {
            button.classList.add("active");
        }
    });

    // Toggle categories
    document.getElementById("toggle-cats-btn").addEventListener('click', function () {
        var details = document.querySelectorAll('details:not(.method, details.method-all)');
        details.forEach(function(detail) {
            detail.toggleAttribute('open');
        });
    });
    // Close methods
    document.getElementById("close-methods-btn").addEventListener('click', function () {
        var details = document.querySelectorAll('details.method, details.method-all');
        details.forEach(function(detail) {
            detail.removeAttribute('open');
        });
    });
};

// For opening and closing the lightbox
document.addEventListener('click', function (event) {
    if (document.getElementById('lightbox').style.display != 'none') {
        // Close lightbox
        document.getElementById('lightbox').style.display = 'none';
    }
    else if (event.target.tagName == 'IMG') {
        // Open lightbox
        document.getElementById('lightbox-image').src = event.target.src;
        document.getElementById('lightbox').style.display = 'block';
    }
});