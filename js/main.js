document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    (function () {
        const track = document.getElementById("marqueeTrack");
        if (!track) return;

        // Prevent double-initializing (helpful with hot reload / re-renders)
        if (track.dataset.marqueeInit === "1") return;
        track.dataset.marqueeInit = "1";

        // Wrap ONLY element children (no whitespace text nodes)
        const set = document.createElement("div");
        set.className = "marquee-set";
        set.style.display = "flex";
        set.style.gap = getComputedStyle(track).gap;

        while (track.firstElementChild) {
            set.appendChild(track.firstElementChild);
        }

        track.appendChild(set);

        // Clone once => 2 identical sets
        const clone = set.cloneNode(true);
        track.appendChild(clone);

        const pixelsPerSecond = 120;

        const measure = () => {
            const w = set.getBoundingClientRect().width;
            track.style.setProperty("--marquee-shift", `${w}px`);
            track.style.setProperty("--marquee-duration", `${w / pixelsPerSecond}s`);
        };

        // Wait for fonts/icons to load so widths don't change mid-animation
        const start = () => {
            measure();
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => requestAnimationFrame(start));
        } else {
            window.addEventListener("load", () => requestAnimationFrame(start), { once: true });
        }

        let r;
        window.addEventListener("resize", () => {
            cancelAnimationFrame(r);
            r = requestAnimationFrame(measure);
        });
    })();


    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // Calculator Logic
    // Logic moved to js/calculator-full.js for consistency across pages

    // Mouse Spotlight Effect
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    });

    // Text Flip Animation
    function initTextFlip() {
        const wrapper = document.querySelector('.flip-wrapper');
        if (!wrapper) return;

        const items = wrapper.querySelectorAll('.flip-item');
        const totalItems = items.length;
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            const translateY = -(currentIndex * 1.2) + 'em'; // 1.2em is the height
            wrapper.style.transform = `translateY(${translateY})`;
        }, 2500);
    }

    initTextFlip();
});
