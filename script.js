const reveals = document.querySelectorAll('.reveal, .genia-reveal');
const counters = document.querySelectorAll('[data-count]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (reducedMotion) {
        element.textContent = target >= 1000 ? target.toLocaleString('fr-FR') : target;
        return;
    }
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

if (reducedMotion) {
    reveals.forEach((element) => element.classList.add('is-visible'));
    counters.forEach((counter) => {
        if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCounter(counter);
        }
    });
} else {
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
}

counters.forEach((counter) => {
    if (!counter.closest('.reveal')) {
        animateCounter(counter);
    }
});

const accordionTriggers = document.querySelectorAll('.genia-accordion-trigger');

const openAccordion = (trigger, panel, item) => {
    trigger.setAttribute('aria-expanded', 'true');
    item.classList.add('is-open');
    if (reducedMotion) {
        panel.style.height = 'auto';
        return;
    }
    panel.style.height = `${panel.scrollHeight}px`;
    const onTransitionEnd = (event) => {
        if (event.propertyName === 'height') {
            panel.style.height = 'auto';
            panel.removeEventListener('transitionend', onTransitionEnd);
        }
    };
    panel.addEventListener('transitionend', onTransitionEnd);
};

const closeAccordion = (trigger, panel, item) => {
    trigger.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');
    if (reducedMotion) {
        panel.style.height = '0px';
        return;
    }
    panel.style.height = `${panel.scrollHeight}px`;
    requestAnimationFrame(() => {
        panel.style.height = '0px';
    });
};

accordionTriggers.forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const item = trigger.closest('.genia-accordion-item');
    if (!panel || !item) {
        return;
    }
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeAccordion(trigger, panel, item);
        } else {
            openAccordion(trigger, panel, item);
        }
    });
});

const calendlyButtons = document.querySelectorAll('[data-calendly]');

calendlyButtons.forEach((button) => {
    const url = button.getAttribute('href');
    if (!url) {
        return;
    }
    button.addEventListener('click', (event) => {
        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
            event.preventDefault();
            window.Calendly.initPopupWidget({ url });
            return;
        }
        event.preventDefault();
        window.open(url, '_blank', 'noopener');
    });
});
