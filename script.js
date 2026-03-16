/* ============================================================
   RUSOVALENCIA — AAAAA PREMIUM JAVASCRIPT
   ============================================================ */

(function () {
    'use strict';

    /* ==== PAGE LOADER ==== */
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loaderProgress');
    let loadProgress = 0;

    function advanceLoader() {
        loadProgress += Math.random() * 25 + 10;
        if (loadProgress > 95) loadProgress = 95;
        if (loaderProgress) loaderProgress.style.width = loadProgress + '%';
    }
    const loadInterval = setInterval(advanceLoader, 200);

    window.addEventListener('load', function () {
        clearInterval(loadInterval);
        if (loaderProgress) loaderProgress.style.width = '100%';
        setTimeout(function () {
            if (loader) loader.classList.add('hidden');
            document.body.style.overflow = '';
            initAllAnimations();
        }, 500);
    });

    /* ==== CUSTOM CURSOR ==== */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

    if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', function (e) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        });

        (function followLoop() {
            followerX += (cursorX - followerX) * 0.12;
            followerY += (cursorY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(followLoop);
        })();

        document.querySelectorAll('a, button, .service-panel, .legal-tile, .tariff-card, .c-card, .cv-glass-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    /* ==== PARTICLE CANVAS ==== */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.3 + 0.1;
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 168, 83, ' + p.alpha + ')';
                ctx.fill();
            });

            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(212, 168, 83, ' + (0.04 * (1 - dist / 150)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==== NAVBAR SCROLL ==== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    function onScroll() {
        const sy = window.scrollY || window.pageYOffset;
        if (navbar) {
            if (sy > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (sy / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ==== MOBILE MENU ==== */
    const navToggle = document.getElementById('navToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    if (navToggle && mobileOverlay) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });
        mobileOverlay.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==== SMOOTH SCROLL ==== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ==== FUNCTIONS AFTER LOAD ==== */
    function initAllAnimations() {
        initScrollReveal();
        initCounters();
        initTilt();
        initMagnetic();
    }

    /* ==== SCROLL REVEAL ==== */
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.reveal || 0;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, parseInt(delay, 10));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    }

    /* ==== NUMBER COUNTERS ==== */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    /* ==== 3D TILT ==== */
    function initTilt() {
        const tiltEls = document.querySelectorAll('[data-tilt]');
        tiltEls.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
                el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
                setTimeout(function () { el.style.transition = ''; }, 600);
            });
        });
    }

    /* ==== MAGNETIC BUTTONS ==== */
    function initMagnetic() {
        var magneticEls = document.querySelectorAll('[data-magnetic]');
        magneticEls.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
                el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                setTimeout(function () { el.style.transition = ''; }, 500);
            });
        });
    }

})();
