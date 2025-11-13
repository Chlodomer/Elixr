// Main Application Logic

const app = {
    // Current state
    state: {
        ethnicity: null,
        hairType: null,
        currentView: 'front',
        age: CONFIG.defaults.age,
        parameters: {
            stress: CONFIG.defaults.stress,
            sun: CONFIG.defaults.sun,
            work: CONFIG.defaults.work,
            smoking: CONFIG.defaults.smoking,
            dyeing: CONFIG.defaults.dyeing
        },
        usingElixr: CONFIG.defaults.usingElixr
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('Elixr Hair Whitening Simulator initialized');
        this.showScreen('welcome-screen');
    },

    /**
     * Show a specific screen
     */
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    },

    /**
     * Select ethnicity
     */
    selectEthnicity(ethnicity) {
        this.state.ethnicity = ethnicity;
        console.log('Selected ethnicity:', ethnicity);
        this.showScreen('hairtype-screen');
    },

    /**
     * Select hair type
     */
    selectHairType(hairType) {
        this.state.hairType = hairType;
        console.log('Selected hair type:', hairType);
        this.showScreen('simulator-screen');
        this.initSimulator();
    },

    /**
     * Initialize the simulator screen
     */
    initSimulator() {
        // Set initial age
        document.getElementById('age-slider').value = this.state.age;
        document.getElementById('age-value').textContent = this.state.age;

        // Set initial slider values
        document.getElementById('stress-slider').value = this.state.parameters.stress;
        document.getElementById('stress-value').textContent = `${this.state.parameters.stress}%`;
        document.getElementById('sun-slider').value = this.state.parameters.sun;
        document.getElementById('sun-value').textContent = `${this.state.parameters.sun}%`;

        // Set Elixr toggle
        this.updateElixrToggle();

        // Update display
        this.updateSimulator();
    },

    /**
     * Update age
     */
    updateAge(age) {
        this.state.age = parseInt(age);
        document.getElementById('age-value').textContent = age;
        document.getElementById('current-age-display').textContent = `Age: ${age}`;
        this.updateSimulator();
    },

    /**
     * Update a parameter
     */
    updateParameter(param, value) {
        if (param === 'stress' || param === 'sun') {
            // Continuous slider values (0-100)
            const intValue = parseInt(value);
            this.state.parameters[param] = intValue;

            // Update label to show percentage
            document.getElementById(`${param}-value`).textContent = `${intValue}%`;
        } else if (param === 'work') {
            // Select dropdown
            this.state.parameters[param] = parseInt(value);
        } else if (param === 'smoking' || param === 'dyeing') {
            // Checkboxes
            this.state.parameters[param] = value;
        }

        console.log('Updated parameter:', param, value);
        this.updateSimulator();
    },

    /**
     * Toggle Elixr usage
     */
    toggleElixr(isUsing) {
        this.state.usingElixr = isUsing;
        this.updateElixrToggle();
        this.updateSimulator();
    },

    /**
     * Update Elixr toggle button states
     */
    updateElixrToggle() {
        const yesBtn = document.getElementById('elixr-yes');
        const noBtn = document.getElementById('elixr-no');

        if (this.state.usingElixr) {
            yesBtn.classList.add('active');
            noBtn.classList.remove('active');
        } else {
            yesBtn.classList.remove('active');
            noBtn.classList.add('active');
        }
    },

    /**
     * Update work environment
     */
    updateWork(value) {
        this.state.parameters.work = value;

        // Update button states
        document.querySelectorAll('.work-btn').forEach(btn => {
            if (parseInt(btn.dataset.value) === value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.updateSimulator();
    },

    /**
     * Switch avatar view
     */
    switchView(view) {
        this.state.currentView = view;

        // Update tab states
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update avatar image
        this.updateAvatarImage();
    },

    /**
     * Update the simulator display
     */
    updateSimulator() {
        // Calculate gray percentages
        const params = {
            ethnicity: this.state.ethnicity,
            age: this.state.age,
            ...this.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);

        // Update comparison display
        document.getElementById('gray-without').textContent = `${result.withoutElixr}%`;
        document.getElementById('gray-with').textContent = `${result.withElixr}%`;

        // Update avatar image based on current usage
        this.updateAvatarImage();
    },

    /**
     * Update avatar image
     */
    updateAvatarImage() {
        // Calculate current gray percentage
        const params = {
            ethnicity: this.state.ethnicity,
            age: this.state.age,
            ...this.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);

        // Use the appropriate percentage based on Elixr usage
        const displayPercent = this.state.usingElixr ? result.withElixr : result.withoutElixr;

        // Get image path
        const imagePath = Calculator.getImagePath(
            this.state.ethnicity,
            this.state.hairType,
            this.state.currentView,
            displayPercent
        );

        // Update image
        const imgElement = document.getElementById('avatar-image');
        imgElement.src = imagePath;
        imgElement.alt = `${CONFIG.ethnicities[this.state.ethnicity].name} with ${displayPercent}% gray hair - ${this.state.currentView} view`;

        // Handle image load error (placeholder)
        imgElement.onerror = () => {
            imgElement.src = this.createPlaceholderImage(displayPercent);
        };
    },

    /**
     * Create a placeholder image with gray percentage
     */
    createPlaceholderImage(grayPercent) {
        // Create SVG placeholder
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
                <rect width="400" height="400" fill="#e2e8f0"/>
                <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="24" fill="#4a5568">
                    ${CONFIG.ethnicities[this.state.ethnicity].name}
                </text>
                <text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="20" fill="#718096">
                    ${CONFIG.hairTypes[this.state.hairType]}
                </text>
                <text x="200" y="260" text-anchor="middle" font-family="Arial" font-size="48" fill="#2d3748" font-weight="bold">
                    ${grayPercent}% Gray
                </text>
                <text x="200" y="300" text-anchor="middle" font-family="Arial" font-size="18" fill="#a0aec0">
                    ${this.state.currentView.toUpperCase()} VIEW
                </text>
            </svg>
        `;

        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    },

    /**
     * Reset the app
     */
    reset() {
        if (confirm('Are you sure you want to start over?')) {
            this.state = {
                ethnicity: null,
                hairType: null,
                currentView: 'front',
                age: CONFIG.defaults.age,
                parameters: {
                    stress: CONFIG.defaults.stress,
                    sun: CONFIG.defaults.sun,
                    work: CONFIG.defaults.work,
                    smoking: CONFIG.defaults.smoking,
                    dyeing: CONFIG.defaults.dyeing
                },
                usingElixr: CONFIG.defaults.usingElixr
            };
            this.showScreen('welcome-screen');
        }
    },

    /**
     * Share results
     */
    shareResults() {
        const params = {
            ethnicity: this.state.ethnicity,
            age: this.state.age,
            ...this.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);

        const shareText = `Elixr Hair Whitening Simulator Results:

At age ${this.state.age}:
- Without Elixr: ${result.withoutElixr}% gray hair
- With Elixr: ${result.withElixr}% gray hair

Elixr reduces hair whitening by ${result.withoutElixr - result.withElixr}%!

Try the simulator: ${window.location.href}`;

        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'Elixr Hair Whitening Simulator',
                text: shareText
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard!');
            }).catch(() => {
                // Final fallback: show in alert
                alert(shareText);
            });
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
