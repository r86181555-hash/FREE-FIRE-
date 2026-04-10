// script.js
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.add('opacity-50');
            nav.classList.remove('active');
        });
        
        // Add to clicked
        this.classList.remove('opacity-50');
        this.classList.add('active');
        
        // Haptic feedback simulation
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    });
});

// Mini player simple play/pause toggle
const playBtn = document.querySelector('.fa-play');
playBtn.addEventListener('click', function() {
    this.classList.toggle('fa-play');
    this.classList.toggle('fa-pause');
});


