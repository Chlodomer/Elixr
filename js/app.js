// Main Application Logic

const app = {
    // Current state
    state: {
        ethnicity: null,
        hairType: null,
        gender: 'male',          // Default gender
        currentView: 'rotate',   // v2.0: Default to rotate view
        currentAge: 30,          // v2.0: User's actual current age
        projectionYears: 0,      // v2.0: How many years into the future (0, 5, 10, 20)
        age: 30,                 // Calculated: currentAge + projectionYears
        parameters: {
            stress: 0,           // v2.0: 0=minimal, 1=moderate, 2=extreme
            sun: 0,              // v2.0: 0=minimal, 1=moderate, 2=extreme
            work: 0,
            smoking: false,
            dyeing: false
        },
        usingElixr: true         // v2.0: Always show both, but keep this for compatibility
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
        this.showScreen('gender-screen');
    },

    /**
     * Select gender
     */
    selectGender(gender) {
        this.state.gender = gender;
        console.log('Selected gender:', gender);

        // Set gender in rotation system
        if (window.HeadRotation) {
            HeadRotation.state.gender = gender;
        }

        this.showScreen('lifestyle1-screen');
    },

    /**
     * Initialize the simulator screen
     */
    initSimulator() {
        // Set gender in rotation system
        if (window.HeadRotation) {
            HeadRotation.state.gender = this.state.gender;
        }

        // v2.0: Show rotation view by default
        this.switchView('rotate');

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
     * Switch avatar view (v2.0: only rotation view)
     */
    switchView(view) {
        this.state.currentView = 'rotate';

        // Update tab state
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.classList.add('active');
        });

        // Show rotation view
        const rotationView = document.getElementById('rotation-view');
        rotationView.style.display = 'block';

        // Initialize rotation if not already initialized
        if (!window.HeadRotation || !HeadRotation.elements.container) {
            HeadRotation.init('rotation-container');
        } else {
            HeadRotation.updateImage();
        }

        // Preload rotation images
        if (ROTATION_CONFIG.preloadImages && window.ImagePreloader) {
            const params = {
                ethnicity: this.state.ethnicity,
                age: this.state.age,
                projectionYears: this.state.projectionYears,
                ...this.state.parameters
            };
            const result = Calculator.calculateGrayPercentage(params);
            const displayPercent = this.state.usingElixr ? result.withElixr : result.withoutElixr;

            ImagePreloader.preloadCurrentSet(
                this.state.ethnicity,
                this.state.hairType,
                displayPercent
            );
        }
    },

    /**
     * Update the simulator display
     */
    updateSimulator() {
        // Calculate gray percentages
        const params = {
            ethnicity: this.state.ethnicity,
            age: this.state.age,
            projectionYears: this.state.projectionYears,
            ...this.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);

        // Update comparison display (both old and new v2.0 inline)
        document.getElementById('gray-without').textContent = `${result.withoutElixr}%`;
        document.getElementById('gray-with').textContent = result.withElixr === 'N/A' ? result.withElixr : `${result.withElixr}%`;

        // v2.0: Update inline comparison boxes
        const withoutInline = document.getElementById('gray-without-inline');
        const withInline = document.getElementById('gray-with-inline');
        if (withoutInline) withoutInline.textContent = `${result.withoutElixr}%`;
        if (withInline) withInline.textContent = result.withElixr === 'N/A' ? result.withElixr : `${result.withElixr}%`;

        // Update avatar image based on current view
        if (this.state.currentView === 'rotate') {
            // Update rotation view
            if (window.HeadRotation && HeadRotation.elements.container) {
                HeadRotation.updateImage();
            }
        } else {
            // Update static view
            this.updateAvatarImage();
        }
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
     * v2.0: Set current age from onboarding and continue
     */
    setCurrentAgeAndContinue() {
        const ageInput = document.getElementById('current-age-input');
        this.state.currentAge = parseInt(ageInput.value) || 30;
        this.state.age = this.state.currentAge + this.state.projectionYears;
        console.log('Set current age:', this.state.currentAge);
        this.showScreen('ethnicity-screen');
    },

    /**
     * v2.0: Update time projection (0, 5, 10, or 20 years)
     */
    updateProjection(years) {
        this.state.projectionYears = years;
        this.state.age = this.state.currentAge + years;

        // Update button states
        document.querySelectorAll('.projection-btn').forEach(btn => {
            if (parseInt(btn.dataset.years) === years) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update current age display
        const ageLabel = document.getElementById('current-age-display-label');
        if (ageLabel) {
            ageLabel.textContent = this.state.currentAge;
        }

        console.log('Projection updated:', { currentAge: this.state.currentAge, projectionYears: years, displayAge: this.state.age });

        // Explicitly update rotation view to show/hide comparison slider immediately
        if (window.HeadRotation && HeadRotation.elements.container) {
            HeadRotation.updateImage();
        }

        this.updateSimulator();
    },

    /**
     * v2.0: Update discrete parameters (stress/sun with 3 levels)
     */
    updateDiscreteParameter(param, value) {
        const intValue = parseInt(value);
        this.state.parameters[param] = intValue;

        const labels = ['Minimal', 'Moderate', 'Extreme'];
        document.getElementById(`${param}-value`).textContent = labels[intValue];

        console.log('Updated discrete parameter:', param, labels[intValue]);
        this.updateSimulator();
    },

    /**
     * Update onboarding parameter (stress/sun)
     */
    updateOnboardingParameter(param, value) {
        const intValue = parseInt(value);
        this.state.parameters[param] = intValue;

        const labels = ['Minimal', 'Moderate', 'Extreme'];
        document.getElementById(`${param}-value-onboarding`).textContent = labels[intValue];

        console.log('Updated onboarding parameter:', param, labels[intValue]);
    },

    /**
     * Continue from lifestyle1 to lifestyle2
     */
    continueToLifestyle2() {
        this.showScreen('lifestyle2-screen');
    },

    /**
     * Update work environment in onboarding
     */
    updateOnboardingWork(value) {
        this.state.parameters.work = value;

        // Update button states in onboarding screen
        const buttons = document.querySelectorAll('#lifestyle2-screen .work-btn');
        buttons.forEach(btn => {
            if (parseInt(btn.dataset.value) === value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        console.log('Updated work environment:', value);
    },

    /**
     * Update checkbox in onboarding
     */
    updateOnboardingCheckbox(param, value) {
        this.state.parameters[param] = value;
        console.log('Updated onboarding checkbox:', param, value);
    },

    /**
     * Complete onboarding and go to simulator
     */
    completeOnboarding() {
        console.log('Onboarding completed with parameters:', this.state.parameters);
        this.showScreen('simulator-screen');
        this.initSimulator();
    },

    /**
     * Share results
     */
    shareResults() {
        const params = {
            ethnicity: this.state.ethnicity,
            age: this.state.age,
            projectionYears: this.state.projectionYears,
            ...this.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);

        let shareText = `Elixr Hair Whitening Simulator Results:

At age ${this.state.age}:
- Without Elixr: ${result.withoutElixr}% gray hair
- With Elixr: ${result.withElixr === 'N/A' ? 'N/A (treatment needs time to work)' : result.withElixr + '% gray hair'}
`;

        if (result.withElixr !== 'N/A') {
            shareText += `\nElixr reduces hair whitening by ${result.withoutElixr - result.withElixr}%!`;
        }

        shareText += `\n\nTry the simulator: ${window.location.href}`;

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
