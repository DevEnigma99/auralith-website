document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to all inputs for reactivity
    const inputs = [
        'monthly-leads',
        'home-price',
        'commission-rate',
        'current-conversion',
        'response-time'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                updateSliderDisplay();
                calculateROI();
            });
        }
    });

    // Initial run
    updateSliderDisplay();
    calculateROI();
});

function updateSliderDisplay() {
    const slider = document.getElementById('response-time');
    const display = document.getElementById('response-time-display');
    if (slider && display) {
        const minutes = parseInt(slider.value);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        let text = '';
        if (hours > 0) text += `${hours} hr${hours > 1 ? 's' : ''} `;
        text += `${mins} min${mins !== 1 ? 's' : ''}`;

        if (minutes === 0) text = 'Instant (< 1 min)';

        display.textContent = text;
    }
}

function calculateROI() {
    // Get values from inputs
    const leadsInput = document.getElementById('monthly-leads');
    const priceInput = document.getElementById('home-price');
    const rateInput = document.getElementById('commission-rate');
    const conversionInput = document.getElementById('current-conversion');
    const responseTimeInput = document.getElementById('response-time'); // Slider in minutes

    const leads = parseFloat(leadsInput.value) || 0;
    const homePrice = parseFloat(priceInput.value) || 0;
    const commissionRate = parseFloat(rateInput.value) || 0;
    const conversionPercent = parseFloat(conversionInput.value) || 0;
    const responseTimeMinutes = parseFloat(responseTimeInput.value) || 0;

    // Convert minutes to hours for logic retention if needed, but we'll use raw minutes for accurate breakdown
    const responseTimeHours = responseTimeMinutes / 60;

    // Calculate Commission Per Deal
    const commissionPerDeal = homePrice * (commissionRate / 100);

    // Convert percentage to decimal
    const conversion = conversionPercent / 100;

    // Calculate current revenue
    const currentDeals = leads * conversion;
    const currentRevenue = currentDeals * commissionPerDeal;

    // Calculate potential revenue (3.91x multiplier from Harvard study)
    const optimalConversion = conversion * 3.91;
    const potentialDeals = leads * optimalConversion;
    const potentialRevenue = potentialDeals * commissionPerDeal;

    // Calculate lost revenue
    const lostRevenueMonthly = potentialRevenue - currentRevenue;
    const lostRevenueYearly = lostRevenueMonthly * 12;

    // Update main results
    setText('current-commission', formatMoney(currentRevenue));
    setText('potential-commission', formatMoney(potentialRevenue));

    // Update simple stats
    const dealsDiff = potentialDeals - currentDeals;
    const hoursSaved = leads * 0.5; // Assuming 30 mins per lead
    setText('leads-saved', dealsDiff.toFixed(1));
    setText('hours-saved', Math.round(hoursSaved));

    // Update Lost Revenue (Monthly & Yearly)
    setText('lost-commission-monthly', formatMoney(lostRevenueMonthly));
    setText('lost-commission-yearly', formatMoney(lostRevenueYearly));

    // Generate Insight
    generateInsight(responseTimeHours, lostRevenueMonthly, lostRevenueYearly);

    // Generate Breakdown Table
    generateBreakdownTable(leads, commissionPerDeal, conversion, potentialRevenue, responseTimeHours);
}

function generateInsight(responseTimeHours, lostMonthly, lostYearly) {
    const insightBox = document.getElementById('insight-box');
    if (!insightBox) return;

    let insightHTML = '';
    // < 5 mins (0.083 hours) is considered excellent
    if (responseTimeHours < 0.083) {
        insightHTML = `<div class="insight-content success">
            <i class="fas fa-trophy"></i>
            <div>
                <strong>Excellent!</strong> You're responding instantly. You're in the top 1% of agents.
            </div>
        </div>`;
    } else if (responseTimeHours < 1) {
        insightHTML = `<div class="insight-content warning">
            <i class="fas fa-bolt"></i>
            <div>
                <strong>Good start!</strong> But every minute counts. Automating to instant response could add <strong>${formatMoney(lostMonthly)}/mo</strong>.
            </div>
        </div>`;
    } else if (responseTimeHours < 4) {
        insightHTML = `<div class="insight-content caution">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>Opportunity zone:</strong> You're losing significant revenue. Most of your leads have contacted 2-3 other agents by now.
            </div>
        </div>`;
    } else {
        insightHTML = `<div class="insight-content critical">
            <i class="fas fa-ban"></i>
            <div>
                <strong>Critical:</strong> At this response time, most leads are already working with another agent. <br>This is costing you <strong>${formatMoney(lostYearly)} per year</strong>.
            </div>
        </div>`;
    }

    insightBox.innerHTML = insightHTML;
}

function generateBreakdownTable(leads, commission, conversion, maxPotentialRevenue, currentResponseTimeHours) {
    const tableBody = document.getElementById('breakdown-body');
    if (!tableBody) return;

    // Data from source calculator logic (Harvard Study/InsideSales.com data approx)
    const timeBreakdown = [
        { time: '1 minute', multiplier: 3.91, hours: 0.017 },
        { time: '5 minutes', multiplier: 2.5, hours: 0.083 },
        { time: '30 minutes', multiplier: 2.0, hours: 0.5 },
        { time: '1 hour', multiplier: 1.5, hours: 1 },
        { time: '2 hours', multiplier: 1.2, hours: 2 },
        { time: '4 hours', multiplier: 0.8, hours: 4 },
        { time: '24 hours', multiplier: 0.3, hours: 24 }
    ];

    // Find closest to current response time for highlighting
    let closest = timeBreakdown[0];
    let minDiff = Math.abs(timeBreakdown[0].hours - currentResponseTimeHours);

    for (let i = 1; i < timeBreakdown.length; i++) {
        const diff = Math.abs(timeBreakdown[i].hours - currentResponseTimeHours);
        if (diff < minDiff) {
            minDiff = diff;
            closest = timeBreakdown[i];
        }
    }

    let html = '';
    timeBreakdown.forEach(item => {
        const adjustedConversion = conversion * item.multiplier;
        const deals = leads * adjustedConversion;
        const revenue = deals * commission;
        const lost = maxPotentialRevenue - revenue; // Compared to best possible (1 min)

        // Formatting logic
        const isHighlight = item === closest;
        const rowClass = isHighlight ? 'highlight-row' : '';
        // If revenue is basically the max, it's green/optimal.
        // We use a small threshold for floating point errors
        const isOptimal = lost < 1;
        const lostClass = !isOptimal ? 'text-red' : 'text-green';
        const lostText = !isOptimal ? `-${formatMoney(lost)}` : 'Optimal';

        html += `
            <tr class="${rowClass}">
                <td>${item.time}</td>
                <td>${(adjustedConversion * 100).toFixed(1)}% <span class="text-muted">(${deals.toFixed(1)} deals)</span></td>
                <td>${formatMoney(revenue)}</td>
                <td class="${lostClass}">${lostText}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Helpers
function formatMoney(amount) {
    return '$' + Math.max(0, Math.round(amount)).toLocaleString('en-US');
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = text;
}
