document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
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
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateROI);
        // Initial calculation
        calculateROI();
    }

    function calculateROI() {
        const leads = parseFloat(document.getElementById('monthly-leads').value) || 0;
        const price = parseFloat(document.getElementById('home-price').value) || 0;
        const commissionRate = parseFloat(document.getElementById('commission-rate').value) || 0;
        const currentConv = parseFloat(document.getElementById('current-conversion').value) || 0;

        // Current
        const currentDeals = leads * (currentConv / 100);
        const commissionPerDeal = price * (commissionRate / 100); // Usually split, but let's assume gross for simplicity or agent side
        // Let's assume the input is the agent's take or total GCI.
        // Standard GCI calculation: Price * Rate
        const currentCommission = currentDeals * commissionPerDeal;

        // With Auralith (Assuming 3x conversion or specific boost)
        // Let's be conservative and say +2% absolute or 2x relative.
        // The prompt says "Potential commission with Auralith".
        // Let's assume a 3x boost for "Speed to Lead" impact.
        const newConv = currentConv * 3;
        const newDeals = leads * (newConv / 100);
        const newCommission = newDeals * commissionPerDeal;

        const lostCommission = newCommission - currentCommission;
        const dealsDiff = newDeals - currentDeals;
        const hoursSaved = leads * 0.5; // Assuming 30 mins per lead follow up manually

        // Update DOM
        document.getElementById('current-commission').textContent = formatCurrency(currentCommission);
        document.getElementById('potential-commission').textContent = formatCurrency(newCommission);
        document.getElementById('lost-commission').textContent = formatCurrency(lostCommission);

        document.getElementById('leads-saved').textContent = Math.round(dealsDiff * 10) / 10;
        document.getElementById('hours-saved').textContent = Math.round(hoursSaved);
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    }
    
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
