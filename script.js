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

const geniaSection = document.querySelector('#genia-about');
if (geniaSection) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const geniaReveals = geniaSection.querySelectorAll('.genia-reveal');
    const geniaCounters = geniaSection.querySelectorAll('[data-genia-count]');
    const staggerItems = geniaSection.querySelectorAll('[data-stagger]');

    staggerItems.forEach((item, index) => {
        item.style.setProperty('--genia-stagger', `${index * 120}ms`);
    });

    const animateGeniaCounter = (element) => {
        const target = Number(element.dataset.geniaCount);
        const duration = 1200;
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

    if (prefersReducedMotion) {
        geniaReveals.forEach((element) => element.classList.add('is-visible'));
        geniaCounters.forEach((counter) => {
            counter.textContent = counter.dataset.geniaCount;
        });
    } else {
        const geniaObserver = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        entry.target.querySelectorAll('[data-genia-count]').forEach((counter) => {
                            if (!counter.dataset.animated) {
                                counter.dataset.animated = 'true';
                                animateGeniaCounter(counter);
                            }
                        });
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        geniaReveals.forEach((element) => geniaObserver.observe(element));
    }

    const accordionTriggers = geniaSection.querySelectorAll('.genia-accordion-trigger');
    accordionTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const panelId = trigger.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!isExpanded));
            if (panel) {
                if (!isExpanded) {
                    panel.classList.add('is-open');
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                } else {
                    panel.style.maxHeight = '0px';
                    panel.classList.remove('is-open');
                }
            }
        });
    });

    const calendlyUrl = 'https://calendly.com/TON_COMPTE/ton-evenement';
    const calendlyButtons = [
        document.getElementById('geniaCalendlyBtn'),
        document.getElementById('geniaCalendlyBtnSecondary')
    ].filter(Boolean);

    calendlyButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                window.Calendly.initPopupWidget({ url: calendlyUrl });
                return;
            }
            window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
        });
    });
}
