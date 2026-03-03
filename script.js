/* ============================================================
   KRISHAN KUMAR AWASTHI — PORTFOLIO MAIN SCRIPT
   Three.js 3D · GSAP Animations · Typed.js · Custom Cursor
   ============================================================ */

(function () {
    'use strict';

    /* ===========================================
       1. PRELOADER
       =========================================== */
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('hidden');
            initAnimations();
        }, 1800);
    });

    /* ===========================================
       2. THREE.JS — 3D PARTICLE BACKGROUND
       =========================================== */
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 30;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const colors = [
        [0, 0.94, 1],       // Cyan #00F0FF
        [0.48, 0.18, 0.97], // Purple #7B2FF7
        [1, 0.18, 0.67],    // Pink #FF2DAA
        [0, 1, 0.53]        // Green #00FF88
    ];

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 80;
        posArray[i3 + 1] = (Math.random() - 0.5) * 80;
        posArray[i3 + 2] = (Math.random() - 0.5) * 80;

        const color = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i3] = color[0];
        colorsArray[i3 + 1] = color[1];
        colorsArray[i3 + 2] = color[2];
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Floating Geometric Shapes
    const shapes = [];
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });

    function createShape(geometry, x, y, z, scale) {
        const mesh = new THREE.Mesh(geometry, shapeMaterial.clone());
        mesh.position.set(x, y, z);
        mesh.scale.set(scale, scale, scale);
        mesh.material.opacity = 0.06 + Math.random() * 0.1;
        scene.add(mesh);
        shapes.push({
            mesh,
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.008,
                z: (Math.random() - 0.5) * 0.005
            },
            floatSpeed: 0.3 + Math.random() * 0.5,
            floatAmplitude: 0.5 + Math.random() * 1.5,
            initialY: y
        });
    }

    createShape(new THREE.IcosahedronGeometry(1, 0), -15, 8, -10, 3);
    createShape(new THREE.OctahedronGeometry(1, 0), 18, -5, -8, 2.5);
    createShape(new THREE.TetrahedronGeometry(1, 0), -10, -12, -5, 2);
    createShape(new THREE.TorusGeometry(1, 0.3, 8, 16), 12, 12, -12, 2);
    createShape(new THREE.DodecahedronGeometry(1, 0), 0, -8, -15, 1.8);
    createShape(new THREE.BoxGeometry(1, 1, 1), -18, 0, -10, 2.2);
    createShape(new THREE.IcosahedronGeometry(1, 1), 20, 5, -18, 1.5);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Rotate particle system
        particleSystem.rotation.x = elapsed * 0.03;
        particleSystem.rotation.y = elapsed * 0.02;

        // Animate shapes
        shapes.forEach(s => {
            s.mesh.rotation.x += s.rotSpeed.x;
            s.mesh.rotation.y += s.rotSpeed.y;
            s.mesh.rotation.z += s.rotSpeed.z;
            s.mesh.position.y = s.initialY + Math.sin(elapsed * s.floatSpeed) * s.floatAmplitude;
        });

        // Camera follow mouse
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ===========================================
       3. CUSTOM CURSOR
       =========================================== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function updateCursor() {
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';

        ringX += (cursorX - ringX) * 0.12;
        ringY += (cursorY - ringY) * 0.12;

        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect for links and buttons
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category, .social-link, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });

    /* ===========================================
       4. TYPED.JS — HERO TYPEWRITER
       =========================================== */
    new Typed('#typed-output', {
        strings: [
            'Full-Stack Developer',
            'Flutter Developer',
            'Web Developer',
            'CS Student',
            'UI/UX Enthusiast',
            'Problem Solver'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        cursorChar: '|'
    });

    /* ===========================================
       5. NAVIGATION
       =========================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    // Scroll-based navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Active link tracking
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            navItems.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Intersection Observer for active nav link
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => navObserver.observe(section));

    /* ===========================================
       6. GSAP SCROLL ANIMATIONS
       =========================================== */
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero animations (these play immediately, no scroll trigger needed)
        const heroTl = gsap.timeline({ delay: 0.3 });
        heroTl
            .from('.hero-badge', { y: 30, opacity: 0, duration: 0.6 })
            .from('.greeting', { y: 30, opacity: 0, duration: 0.5 }, '-=0.2')
            .from('.name-main', { y: 40, opacity: 0, duration: 0.6 }, '-=0.2')
            .from('.name-accent', { y: 40, opacity: 0, duration: 0.6 }, '-=0.3')
            .from('.hero-typed-wrapper', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
            .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
            .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.4, stagger: 0.15 }, '-=0.2')
            .from('.stat-item', { y: 30, opacity: 0, duration: 0.4, stagger: 0.1 }, '-=0.1')
            .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.1');

        // About section
        gsap.fromTo('.about-image-wrapper',
            { x: -80, opacity: 0 },
            { scrollTrigger: { trigger: '.about', start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );
        gsap.fromTo('.about-content',
            { x: 80, opacity: 0 },
            { scrollTrigger: { trigger: '.about', start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );
        gsap.fromTo('.info-item',
            { y: 30, opacity: 0 },
            { scrollTrigger: { trigger: '.about-info-grid', start: 'top 90%', once: true }, y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
        );

        // Skills section
        gsap.fromTo('.skill-category',
            { y: 50, opacity: 0 },
            { scrollTrigger: { trigger: '.skills', start: 'top 80%', once: true }, y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
        );

        // Animate skill bars
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.getAttribute('data-width');
            gsap.to(bar, {
                scrollTrigger: { trigger: bar, start: 'top 95%', once: true },
                width: width + '%',
                duration: 1.5,
                ease: 'power3.out'
            });
        });

        // Tech orbit
        gsap.fromTo('.tech-orbit',
            { scale: 0.5, opacity: 0 },
            { scrollTrigger: { trigger: '.tech-orbit', start: 'top 90%', once: true }, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }
        );

        // Projects
        gsap.fromTo('.project-card',
            { y: 60, opacity: 0 },
            { scrollTrigger: { trigger: '.projects', start: 'top 80%', once: true }, y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power2.out' }
        );

        // Timeline
        gsap.fromTo('.timeline-item',
            { x: -50, opacity: 0 },
            { scrollTrigger: { trigger: '.timeline', start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.7, stagger: 0.3, ease: 'power2.out' }
        );

        // Contact
        gsap.fromTo('.contact-info-panel',
            { x: -60, opacity: 0 },
            { scrollTrigger: { trigger: '.contact', start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
        gsap.fromTo('.contact-form',
            { x: 60, opacity: 0 },
            { scrollTrigger: { trigger: '.contact', start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header,
                { y: 40, opacity: 0 },
                { scrollTrigger: { trigger: header, start: 'top 90%', once: true }, y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }
            );
        });

        // Refresh ScrollTrigger after layout settles
        setTimeout(() => ScrollTrigger.refresh(), 500);

        // Safety fallback: ensure everything is visible after 5 seconds
        setTimeout(() => {
            document.querySelectorAll('.skill-category, .project-card, .timeline-item, .contact-info-panel, .contact-form, .about-image-wrapper, .about-content, .info-item, .tech-orbit, .section-header').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }, 5000);
    }

    /* ===========================================
       7. COUNTER ANIMATION
       =========================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterDone = false;

    function animateCounters() {
        if (counterDone) return;
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.ceil(current);
                }
            }, 30);
        });
        counterDone = true;
    }

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 2200);
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    heroObserver.observe(document.getElementById('hero'));

    /* ===========================================
       8. BACK TO TOP
       =========================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===========================================
       9. CONTACT FORM
       =========================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');
        const originalText = btnText.textContent;

        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                btnText.textContent = 'Message Sent!';
                btnIcon.className = 'fas fa-check';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
                contactForm.reset();
                setTimeout(() => {
                    btnText.textContent = originalText;
                    btnIcon.className = 'fas fa-paper-plane';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                throw new Error('Failed');
            }
        } catch (err) {
            btnText.textContent = 'Error! Try Again';
            btnIcon.className = 'fas fa-exclamation-triangle';
            submitBtn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            setTimeout(() => {
                btnText.textContent = originalText;
                btnIcon.className = 'fas fa-paper-plane';
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });

    /* ===========================================
       10. VANILLA TILT INIT
       =========================================== */
    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 8,
            speed: 400,
            glare: false,
            'max-glare': 0.15,
            perspective: 1000
        });
    }

    /* ===========================================
       11. SMOOTH SCROLL FOR ANCHOR LINKS
       =========================================== */
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

    /* ===========================================
       12. PARALLAX EFFECT ON SCROLL (SUBTLE)
       =========================================== */
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Move particles slightly for depth
        if (particleSystem) {
            particleSystem.position.y = scrolled * 0.005;
        }
    });

    /* ===========================================
       13. INPUT PLACEHOLDER FIX
       =========================================== */
    // Add invisible placeholder for :not(:placeholder-shown) CSS trick
    document.querySelectorAll('.input-wrapper input, .input-wrapper textarea').forEach(input => {
        input.setAttribute('placeholder', ' ');
    });

    /* ===========================================
       14. DARK / LIGHT THEME TOGGLE
       =========================================== */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('kka-theme');

    // Apply saved theme on load
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        particlesMaterial.opacity = 0.4;
        shapes.forEach(s => { s.mesh.material.opacity = 0.04; });
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('kka-theme', isLight ? 'light' : 'dark');

        // Adjust Three.js visuals for light mode
        if (isLight) {
            particlesMaterial.opacity = 0.4;
            shapes.forEach(s => { s.mesh.material.opacity = 0.04; });
        } else {
            particlesMaterial.opacity = 0.7;
            shapes.forEach(s => { s.mesh.material.opacity = 0.06 + Math.random() * 0.1; });
        }
    });

})();
