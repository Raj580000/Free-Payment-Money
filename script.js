document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const TOTAL_SHARES_REQUIRED = 11;
    const WHATSAPP_SHARE_MESSAGE = "Hey! I'm getting ₹49 for free just by sharing a link. You can get it too! Check it out: ";

    // --- DOM ELEMENTS ---
    const startNowBtn = document.getElementById('start-now-btn');
    const sharingSection = document.getElementById('sharing-section');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const whatsappShareBtn = document.getElementById('whatsapp-share-btn');
    const shareTracker = document.getElementById('share-tracker');
    
    // Sticky box elements
    const stickyBox = document.getElementById('sticky-progress-box');
    const stickyProgressCount = document.getElementById('sticky-progress-count');
    const stickyShareBtn = document.getElementById('sticky-share-btn');

    // Trust counter elements
    const dynamicWinnerEl = document.getElementById('dynamic-winner');

    // Modal elements
    const modal = document.getElementById('congrats-modal');
    const claimRewardBtn = document.getElementById('claim-reward-btn');

    // --- STATE MANAGEMENT ---
    let currentShares = 0;

    // --- FAKE TRUST COUNTER DATA ---
    const fakeNames = ["Rohit", "Priya", "Amit", "Sunita", "Vikram", "Neha", "Arjun", "Kavita"];
    const fakeLocations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad"];

    // --- INITIALIZATION ---
    function initialize() {
        loadProgress();
        setupEventListeners();
        generateShareTracker();
        updateUI();
        startDynamicWinner();
    }

    // --- CORE FUNCTIONS ---
    function loadProgress() {
        const savedShares = localStorage.getItem('shareCount');
        if (savedShares) {
            currentShares = parseInt(savedShares, 10);
        }
    }

    function saveProgress() {
        localStorage.setItem('shareCount', currentShares);
    }

    function generateShareTracker() {
        shareTracker.innerHTML = '';
        for (let i = 0; i < TOTAL_SHARES_REQUIRED; i++) {
            const item = document.createElement('div');
            item.classList.add('tracker-item');
            item.dataset.index = i;
            shareTracker.appendChild(item);
        }
    }

    function updateUI() {
        // Update Progress Bar
        const percentage = (currentShares / TOTAL_SHARES_REQUIRED) * 100;
        progressBar.style.width = `${percentage}%`;

        // Update Progress Text
        progressText.textContent = `${currentShares} / ${TOTAL_SHARES_REQUIRED} Shares`;

        // Update Share Tracker visuals
        const trackerItems = document.querySelectorAll('.tracker-item');
        trackerItems.forEach((item, index) => {
            if (index < currentShares) {
                item.classList.add('completed');
                item.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                item.classList.remove('completed');
                item.innerHTML = '';
            }
        });
        
        // Update Sticky Progress Box
        stickyProgressCount.textContent = currentShares;
        if (currentShares > 0 && currentShares < TOTAL_SHARES_REQUIRED) {
            stickyBox.classList.add('visible');
        } else {
            stickyBox.classList.remove('visible');
        }

        // Configure WhatsApp share link
        const currentUrl = window.location.href;
        const message = encodeURIComponent(WHATSAPP_SHARE_MESSAGE + currentUrl);
        whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${message}`;
        
        // Check for completion
        if (currentShares >= TOTAL_SHARES_REQUIRED) {
            handleCompletion();
        }
    }

    function handleShareClick(e) {
        // Prevent default navigation for the demo. In a real scenario, you might let it open WhatsApp.
        e.preventDefault(); 
        
        if (currentShares >= TOTAL_SHARES_REQUIRED) return;

        currentShares++;
        saveProgress();
        updateUI();

        // Visual feedback
        whatsappShareBtn.classList.add('grow');
        setTimeout(() => {
            whatsappShareBtn.classList.remove('grow');
        }, 400);

        // Open WhatsApp link in a new tab
        window.open(whatsappShareBtn.href, '_blank');
    }

    function handleCompletion() {
        whatsappShareBtn.disabled = true;
        whatsappShareBtn.textContent = 'Task Completed!';
        whatsappShareBtn.style.backgroundColor = '#6c757d';
        stickyBox.classList.remove('visible');
        
        setTimeout(() => {
            modal.classList.remove('hidden');
            triggerConfetti();
        }, 500);
    }
    
    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const confettiInstance = confetti.create(canvas, {
            resize: true,
            useWorker: true
        });
        confettiInstance({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    function startDynamicWinner() {
        setInterval(() => {
            const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            const randomLocation = fakeLocations[Math.floor(Math.random() * fakeLocations.length)];
            dynamicWinnerEl.textContent = `🎉 ${randomName} from ${randomLocation} just won ₹49!`;
            
            // Fade in/out effect
            dynamicWinnerEl.style.opacity = 0;
            setTimeout(() => { dynamicWinnerEl.style.opacity = 1; }, 200);

        }, 5000); // Rotates every 5 seconds
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        startNowBtn.addEventListener('click', () => {
            sharingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        stickyShareBtn.addEventListener('click', () => {
             sharingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        whatsappShareBtn.addEventListener('click', handleShareClick);

        claimRewardBtn.addEventListener('click', () => {
            const paytmNumber = document.getElementById('paytm-number').value;
            if (paytmNumber && paytmNumber.length === 10 && !isNaN(paytmNumber)) {
                // IMPORTANT: This is where you would typically redirect to another monetized page.
                // For this demo, we'll just show an alert.
                alert(`Thank you! Your request for Paytm number ${paytmNumber} is being processed.\n(This is a demo - you will now be redirected to an offer).`);
                // Example redirect: window.location.href = 'https://your-next-offer-page.com';
            } else {
                alert('Please enter a valid 10-digit Paytm number.');
            }
        });
    }

    // --- Let's Go! ---
    initialize();
});