// Exit Intent Popup Logic
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already closed the popup
    if (localStorage.getItem('auralith_popup_closed')) return;

    let mouseLeft = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !mouseLeft) {
            mouseLeft = true;
            showExitPopup();
        }
    });

    function showExitPopup() {
        // Create Popup HTML
        const popup = document.createElement('div');
        popup.id = 'exit-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        popup.innerHTML = `
            <div style="background: #0a0a0a; border: 1px solid var(--accent-blue); padding: 2rem; border-radius: 16px; max-width: 500px; width: 90%; text-align: center; position: relative; box-shadow: 0 0 50px rgba(75, 163, 255, 0.2);">
                <button id="close-popup" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">&times;</button>
                <h2 style="color: white; margin-bottom: 0.5rem;">Wait! Don't Leave Empty Handed.</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Get our "2025 Realtor Automation Blueprint" for free. Learn how to add $50k/mo to your GCI.</p>
                <form action="blueprint-delivery.html" style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="email" placeholder="Enter your email" required style="padding: 1rem; border-radius: 8px; border: 1px solid #333; background: #111; color: white;">
                    <button type="submit" class="btn btn-primary">Send Me The Blueprint</button>
                </form>
                <p style="margin-top: 1rem; font-size: 0.8rem; color: #555; cursor: pointer;" onclick="document.getElementById('exit-popup').remove(); localStorage.setItem('auralith_popup_closed', 'true');">No thanks, I hate money.</p>
            </div>
        `;

        document.body.appendChild(popup);

        // Trigger reflow
        popup.offsetHeight;
        popup.style.opacity = '1';

        document.getElementById('close-popup').addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.remove();
                localStorage.setItem('auralith_popup_closed', 'true');
            }, 300);
        });
    }
});

// Calculator Gating Logic
function gateCalculator() {
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        // Remove old listener
        const newBtn = calcBtn.cloneNode(true);
        calcBtn.parentNode.replaceChild(newBtn, calcBtn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Check if email is already provided (simulated)
            if (sessionStorage.getItem('auralith_lead_captured')) {
                calculateROI(); // Call original function from main.js
            } else {
                showLeadCaptureModal();
            }
        });
    }
}

function showLeadCaptureModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a0a; border: 1px solid var(--glass-border); padding: 2rem; border-radius: 16px; max-width: 400px; width: 90%; text-align: center;">
            <i class="fas fa-lock" style="font-size: 3rem; color: var(--accent-blue); margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Unlock Your Report</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Enter your email to see your potential ROI and get a breakdown sent to your inbox.</p>
            <form id="lead-capture-form">
                <input type="email" id="lead-email" placeholder="Best email address" required style="width: 100%; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #333; background: #111; color: white;">
                <button type="submit" class="btn btn-primary" style="width: 100%;">Reveal My Results</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('lead-capture-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('lead-email').value;
        if (email) {
            sessionStorage.setItem('auralith_lead_captured', 'true');
            modal.remove();
            calculateROI(); // Trigger calculation
        }
    });
}

// Initialize Gating if on Calculator Page
if (window.location.href.includes('calculator.html')) {
    // Wait for main.js to load
    window.addEventListener('load', gateCalculator);
}
