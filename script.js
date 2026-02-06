const reveals = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');

const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(target * progress);
        element.textContent = target >= 1000 ? value.toLocaleString('fr-FR') : value;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.querySelector('[data-count]')) {
                    entry.target.querySelectorAll('[data-count]').forEach((counter) => {
                        if (!counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            animateCounter(counter);
                        }
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.4 }
);

reveals.forEach((element) => observer.observe(element));

counters.forEach((counter) => {
    if (!counter.closest('.reveal')) {
        animateCounter(counter);
    }
});
