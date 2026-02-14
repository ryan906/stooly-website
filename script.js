// ── Cursor Glow ──────────────────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = -200, mouseY = -200;
let glowX = -200, glowY = -200;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
    requestAnimationFrame(animateCursorGlow);
}
animateCursorGlow();

// ── Navigation ───────────────────────────────────────────────
const nav = document.getElementById('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 80) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
    lastScrollY = currentScrollY;
}, { passive: true });

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// ── Scroll Reveal Animations ─────────────────────────────────
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── Hero Animations on Load ──────────────────────────────────
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ── Animated Score Counter ───────────────────────────────────
const scoreEl = document.querySelector('.score-big-number');
let scoreAnimated = false;

if (scoreEl) {
    const scoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !scoreAnimated) {
                scoreAnimated = true;
                animateCounter(scoreEl, 0, parseInt(scoreEl.dataset.target), 1500);
                scoreObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    scoreObserver.observe(scoreEl);
}

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        el.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ── Score Factor Bars Animation ──────────────────────────────
const factorBars = document.querySelectorAll('.factor-bar');

const factorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            factorObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

factorBars.forEach(bar => factorObserver.observe(bar));

// ── Smooth Scroll for Anchor Links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ── Parallax for Hero Orbs ───────────────────────────────────
const orbs = document.querySelectorAll('.hero-bg .orb');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrollY < heroHeight) {
        const factor = scrollY / heroHeight;
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.15;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
}, { passive: true });

// ── Staggered Feature Cards ──────────────────────────────────
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
});

// ── Staggered Pricing Cards ──────────────────────────────────
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
});

// ── Staggered Privacy Points ─────────────────────────────────
const privacyPoints = document.querySelectorAll('.privacy-point');
privacyPoints.forEach((point, i) => {
    point.style.transitionDelay = `${i * 0.1}s`;
});

// ── Staggered Steps ─────────────────────────────────────────
const steps = document.querySelectorAll('.step');
steps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.15}s`;
});

// ── Notify Form (Formspree) ─────────────────────────────────
const notifyForm = document.getElementById('notifyForm');
const notifySuccess = document.getElementById('notifySuccess');

if (notifyForm) {
    notifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = notifyForm.querySelector('.btn-notify');
        const btnText = btn.querySelector('.notify-btn-text');
        const btnSending = btn.querySelector('.notify-btn-sending');
        const btnIcon = btn.querySelector('.notify-btn-icon');

        btn.disabled = true;
        btnText.style.display = 'none';
        btnSending.style.display = 'inline';
        btnIcon.style.display = 'none';

        try {
            const response = await fetch(notifyForm.action, {
                method: 'POST',
                body: new FormData(notifyForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                notifyForm.style.display = 'none';
                notifySuccess.style.display = 'flex';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            btn.disabled = false;
            btnText.textContent = 'Try Again';
            btnText.style.display = 'inline';
            btnSending.style.display = 'none';
            btnIcon.style.display = 'block';
        }
    });
}
