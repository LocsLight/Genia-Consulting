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

const homeSection = document.querySelector('#home');
const homeWaveCanvas = homeSection?.querySelector('.home-voicewave-canvas');

if (homeSection && homeWaveCanvas) {
    const ctx = homeWaveCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let samples = [];
    let sampleCount = 0;
    let head = 0;
    let phase = 0;
    let animationFrame;
    let lastTime = 0;
    let sampleProgress = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const createSample = () => {
        phase += 0.35;
        const base =
            Math.sin(phase * 0.85) * 0.55 +
            Math.sin(phase * 1.45 + 1.2) * 0.3 +
            Math.sin(phase * 2.05 + 2.4) * 0.15;
        const noise = (Math.random() - 0.5) * 0.02;
        return clamp(base + noise, -1, 1);
    };

    const setCanvasSize = () => {
        const rect = homeSection.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        homeWaveCanvas.width = Math.max(1, Math.floor(width * dpr));
        homeWaveCanvas.height = Math.max(1, Math.floor(height * dpr));
        homeWaveCanvas.style.width = `${width}px`;
        homeWaveCanvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sampleCount = clamp(Math.round(width / 2), 320, 480);
        samples = Array.from({ length: sampleCount }, () => createSample());
        head = 0;
        sampleProgress = 0;
    };

    const drawWave = (time) => {
        ctx.clearRect(0, 0, width, height);
        const centerY = height * 0.5;
        const amplitudeBase = height * 0.28;
        const breath = 1 + Math.sin(time * 0.0002) * 0.06;
        const amplitude = amplitudeBase * breath;
        const dx = width / (sampleCount - 1);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        const drawPath = () => {
            let prevX = 0;
            let prevY = centerY + samples[head] * amplitude;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            for (let i = 1; i < sampleCount - 1; i += 1) {
                const idx = (head + i) % sampleCount;
                const x = i * dx;
                const y = centerY + samples[idx] * amplitude;
                const cx = (prevX + x) * 0.5;
                const cy = (prevY + y) * 0.5;
                ctx.quadraticCurveTo(prevX, prevY, cx, cy);
                prevX = x;
                prevY = y;
            }
            const lastIdx = (head + sampleCount - 1) % sampleCount;
            const lastX = (sampleCount - 1) * dx;
            const lastY = centerY + samples[lastIdx] * amplitude;
            ctx.quadraticCurveTo(prevX, prevY, lastX, lastY);
        };

        const glowGradient = ctx.createLinearGradient(0, 0, width, 0);
        glowGradient.addColorStop(0, 'rgba(255, 106, 0, 0.18)');
        glowGradient.addColorStop(0.5, 'rgba(109, 40, 217, 0.2)');
        glowGradient.addColorStop(1, 'rgba(168, 85, 247, 0.18)');
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = glowGradient;
        ctx.lineWidth = 12;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.25)';
        ctx.shadowBlur = 18;
        drawPath();
        ctx.stroke();
        ctx.restore();

        const mainGradient = ctx.createLinearGradient(0, 0, width, 0);
        mainGradient.addColorStop(0, 'rgba(255, 106, 0, 0.5)');
        mainGradient.addColorStop(0.5, 'rgba(109, 40, 217, 0.48)');
        mainGradient.addColorStop(1, 'rgba(255, 176, 0, 0.45)');
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = mainGradient;
        ctx.lineWidth = 4;
        drawPath();
        ctx.stroke();
        ctx.restore();
    };

    const step = (time) => {
        if (!document.body.contains(homeSection)) {
            cancelAnimationFrame(animationFrame);
            return;
        }
        if (!lastTime) {
            lastTime = time;
        }
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        const dx = width / (sampleCount - 1);
        const speedSamples = 60 / dx;
        sampleProgress += speedSamples * delta;
        while (sampleProgress >= 1) {
            samples[head] = createSample();
            head = (head + 1) % sampleCount;
            sampleProgress -= 1;
        }
        drawWave(time);
        animationFrame = requestAnimationFrame(step);
    };

    const resizeObserver = new ResizeObserver(() => {
        setCanvasSize();
        drawWave(performance.now());
    });

    setCanvasSize();
    resizeObserver.observe(homeSection);
    if (reducedMotion) {
        drawWave(performance.now());
    } else {
        animationFrame = requestAnimationFrame(step);
    }
}
