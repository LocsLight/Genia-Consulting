const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');

navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                activeLink?.classList.add('active');
            }
        });
    },
    { threshold: 0.6 }
);

document.querySelectorAll('section').forEach((section) => observer.observe(section));
