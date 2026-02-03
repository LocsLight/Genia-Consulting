// Genia Consulting - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialize Sound Wave Animation
    initSoundWave();

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize Smooth Scroll for anchor links
    initSmoothScroll();
});

// Canvas Sound Wave Animation for Hero Section
function initSoundWave() {
    const canvas = document.getElementById('soundWave');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = 256; // 64 * 4 for high DPI
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const bars = 100;
        const barWidth = canvas.width / bars;
        const centerY = canvas.height / 2;

        for (let i = 0; i < bars; i++) {
            // Create wave pattern using multiple sine waves
            const x = i * barWidth;
            const normalizedX = i / bars;
            
            // Combine multiple frequencies for organic movement
            const amplitude = Math.sin(normalizedX * Math.PI * 4 + time) * 0.5 + 
                            Math.sin(normalizedX * Math.PI * 8 + time * 1.5) * 0.25 +
                            Math.sin(normalizedX * Math.PI * 2 + time * 0.5) * 0.25;
            
            const height = Math.abs(amplitude) * canvas.height * 0.8;
            const y = centerY - height / 2;

            // Gradient color based on position
            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, 'rgba(212, 175, 55, 0)');
            gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 1, height);
        }

        time += 0.02;
        animationId = requestAnimationFrame(draw);
    }

    // Only animate when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                draw();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
document.querySelector('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Show success message (in real implementation, this would send data to server)
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Demande envoyée !';
    btn.classList.add('bg-green-500', 'text-white');
    btn.classList.remove('bg-gold', 'text-navy');
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-500', 'text-white');
        btn.classList.add('bg-gold', 'text-navy');
        e.target.reset();
    }, 3000);
});