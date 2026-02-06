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

const homeSection = document.querySelector('#home') || document.querySelector('h1')?.closest('section');
const homeWaveCanvas = homeSection?.querySelector('.home-voicewave-canvas');

if (homeSection && homeWaveCanvas) {
    const ctx = homeWaveCanvas.getContext('2d');
    let animationFrame;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointCount = 220;
    const noiseSize = 72;

    const createNoise = () =>
        Array.from({ length: noiseSize }, () => Math.random() * 2 - 1);

    const noisePrimary = createNoise();
    const noiseSecondary = createNoise();

    const smoothStep = (value) => value * value * (3 - 2 * value);

    const sampleNoise = (noise, x) => {
        const scaled = x * noiseSize;
        const index = Math.floor(scaled) % noiseSize;
        const nextIndex = (index + 1) % noiseSize;
        const fraction = scaled - Math.floor(scaled);
        const eased = smoothStep(fraction);
        return noise[index] + (noise[nextIndex] - noise[index]) * eased;
    };

    const setCanvasSize = () => {
        const rect = homeSection.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = rect.width;
        canvasHeight = rect.height;
        homeWaveCanvas.width = Math.max(1, Math.floor(canvasWidth * dpr));
        homeWaveCanvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
        homeWaveCanvas.style.width = `${canvasWidth}px`;
        homeWaveCanvas.style.height = `${canvasHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawWaveLayer = (options, time) => {
        const centerY = canvasHeight * 0.5;
        const breath = 0.75 + Math.sin(time * 0.0007) * 0.2;
        const amplitude = canvasHeight * 0.12 * breath * options.scale;
        const timeShift = time * options.speed;
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
        gradient.addColorStop(0, options.colors[0]);
        gradient.addColorStop(1, options.colors[1]);

        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < pointCount; i += 1) {
            const t = i / (pointCount - 1);
            const noiseValue =
                (sampleNoise(options.noise, t * 1.3 + timeShift) +
                    0.5 * sampleNoise(options.noise, t * 3.1 - timeShift * 1.2)) /
                1.5;
            const y = centerY + noiseValue * amplitude;
            const x = t * canvasWidth;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = options.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = options.glow;
        ctx.shadowBlur = options.blur;
        ctx.globalAlpha = options.opacity;
        ctx.stroke();
        ctx.restore();
    };

    const drawFrame = (time = 0) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const centerY = canvasHeight * 0.5;

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvasWidth, centerY);
        ctx.stroke();
        ctx.restore();

        ctx.globalCompositeOperation = 'lighter';

        drawWaveLayer(
            {
                colors: ['rgba(109, 40, 217, 0.55)', 'rgba(168, 85, 247, 0.22)'],
                glow: 'rgba(168, 85, 247, 0.4)',
                lineWidth: 10,
                blur: 28,
                opacity: 0.7,
                noise: noiseSecondary,
                scale: 1.05,
                speed: prefersReducedMotion ? 0 : 0.00012,
            },
            time
        );

        drawWaveLayer(
            {
                colors: ['rgba(255, 106, 0, 0.75)', 'rgba(255, 176, 0, 0.4)'],
                glow: 'rgba(255, 176, 0, 0.4)',
                lineWidth: 6,
                blur: 18,
                opacity: 0.85,
                noise: noisePrimary,
                scale: 0.9,
                speed: prefersReducedMotion ? 0 : 0.00018,
            },
            time
        );

        ctx.globalCompositeOperation = 'screen';
        drawWaveLayer(
            {
                colors: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
                glow: 'rgba(255, 255, 255, 0.2)',
                lineWidth: 1.5,
                blur: 6,
                opacity: 0.6,
                noise: noisePrimary,
                scale: 0.75,
                speed: prefersReducedMotion ? 0 : 0.00016,
            },
            time
        );

        ctx.globalCompositeOperation = 'source-over';
    };

    const render = (time) => {
        drawFrame(time);
        animationFrame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(() => {
        setCanvasSize();
        drawFrame(performance.now());
    });

    setCanvasSize();
    resizeObserver.observe(homeSection);
    if (prefersReducedMotion) {
        drawFrame(performance.now());
    } else {
        animationFrame = requestAnimationFrame(render);
    }
}

const geniaCanvas = document.querySelector('#genia-about .genia-waves-canvas');
const geniaHero = document.querySelector('#genia-about .genia-hero');

if (geniaCanvas && geniaHero) {
    const ctx = geniaCanvas.getContext('2d');
    let animationFrame;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let dpr = window.devicePixelRatio || 1;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const blobs = [
        { radius: 220, speed: 0.00045, offset: 0.2, drift: 0.6 },
        { radius: 180, speed: 0.00055, offset: 1.4, drift: 0.5 },
        { radius: 260, speed: 0.00035, offset: 2.6, drift: 0.7 },
        { radius: 200, speed: 0.0005, offset: 3.8, drift: 0.4 },
        { radius: 150, speed: 0.00065, offset: 5.1, drift: 0.6 },
    ];

    const colors = [
        ['rgba(255, 106, 0, 0.5)', 'rgba(255, 176, 0, 0.05)'],
        ['rgba(109, 40, 217, 0.5)', 'rgba(168, 85, 247, 0.05)'],
        ['rgba(255, 122, 0, 0.45)', 'rgba(255, 176, 0, 0.05)'],
        ['rgba(114, 60, 230, 0.45)', 'rgba(168, 85, 247, 0.05)'],
        ['rgba(255, 140, 0, 0.4)', 'rgba(255, 176, 0, 0.05)'],
    ];

    const setCanvasSize = () => {
        const rect = geniaHero.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvasWidth = rect.width;
        canvasHeight = rect.height;
        geniaCanvas.width = Math.max(1, Math.floor(canvasWidth * dpr));
        geniaCanvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
        geniaCanvas.style.width = `${canvasWidth}px`;
        geniaCanvas.style.height = `${canvasHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (time = 0) => {
        if (!document.body.contains(geniaHero)) {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            return;
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalCompositeOperation = 'lighter';
        const baseX = canvasWidth * 0.5;
        const baseY = canvasHeight * 0.5;
        const pulse = 1 + Math.sin(time * 0.0002) * 0.08;

        blobs.forEach((blob, index) => {
            const drift = Math.sin(time * blob.speed + blob.offset) * blob.drift;
            const wave = Math.cos(time * blob.speed * 0.8 + blob.offset) * blob.drift;
            const x = baseX + drift * canvasWidth * 0.15 + Math.sin(time * blob.speed * 1.2 + index) * canvasWidth * 0.12;
            const y = baseY + wave * canvasHeight * 0.15 + Math.cos(time * blob.speed * 1.1 + index) * canvasHeight * 0.1;
            const radius = blob.radius * pulse * (0.9 + Math.sin(time * blob.speed + index) * 0.08);
            const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
            gradient.addColorStop(0, colors[index][0]);
            gradient.addColorStop(1, colors[index][1]);
            ctx.fillStyle = gradient;
            ctx.shadowColor = colors[index][0];
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalCompositeOperation = 'source-over';
    };

    const render = (time) => {
        drawFrame(time);
        animationFrame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(() => {
        setCanvasSize();
        drawFrame(performance.now());
    });

    setCanvasSize();
    resizeObserver.observe(geniaHero);
    if (prefersReducedMotion) {
        drawFrame(performance.now());
    } else {
        animationFrame = requestAnimationFrame(render);
    }
}
