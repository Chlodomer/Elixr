// 3D Head Rotation Logic

const HeadRotation = {
    // Current state
    state: {
        currentAngle: 0,           // Current rotation angle (0-360)
        currentAngleIndex: 0,      // Current frame index (0 to totalAngles-1)
        isDragging: false,         // Is user currently dragging
        startX: 0,                 // Drag start X position
        lastX: 0,                  // Last X position (for velocity calculation)
        velocity: 0,               // Current rotation velocity
        gender: 'male',            // Current gender selection
        animationFrame: null,      // RequestAnimationFrame ID
        isAutoRotating: false,     // Is auto-rotation active
        autoRotateSpeed: 0.5       // Auto-rotation speed (degrees per frame)
    },

    // Reference to DOM elements
    elements: {
        container: null,           // Rotation container
        image: null,               // Main rotation image
        genderToggle: null         // Gender toggle buttons
    },

    /**
     * Initialize the rotation system
     * @param {string} containerId - ID of the rotation container element
     */
    init(containerId = 'rotation-container') {
        console.log('Initializing head rotation...');

        // Get DOM references
        this.elements.container = document.getElementById(containerId);
        this.elements.image = document.getElementById('rotation-image');

        if (!this.elements.container || !this.elements.image) {
            console.error('Rotation elements not found');
            return;
        }

        // Initialize comparison slider
        console.log('[Rotation] window.ComparisonSlider exists?', !!window.ComparisonSlider);
        if (window.ComparisonSlider) {
            console.log('[Rotation] Calling ComparisonSlider.init()');
            ComparisonSlider.init();
        } else {
            console.error('[Rotation] ComparisonSlider not found!');
        }

        // Set initial image
        this.updateImage();

        // Set up event listeners
        this.setupEventListeners();

        // Start animation loop
        this.startAnimationLoop();

        console.log('Head rotation initialized');
    },

    /**
     * Set up mouse and touch event listeners
     */
    setupEventListeners() {
        const container = this.elements.container;

        // Mouse events
        container.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));

        // Touch events (mobile)
        if (ROTATION_CONFIG.enableTouch) {
            container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            document.addEventListener('touchend', this.onTouchEnd.bind(this));
        }

        // Prevent default drag behavior on image
        this.elements.image.addEventListener('dragstart', (e) => e.preventDefault());

        // Add cursor style
        container.style.cursor = 'grab';
    },

    /**
     * Mouse drag start
     */
    onDragStart(e) {
        // Don't start rotation drag if clicking on comparison slider handle
        if (e.target.closest('#comparison-slider-handle')) {
            return;
        }

        this.state.isDragging = true;
        this.state.startX = e.clientX;
        this.state.lastX = e.clientX;
        this.state.velocity = 0;
        this.elements.container.style.cursor = 'grabbing';

        // Stop auto-rotation when user manually drags
        if (this.state.isAutoRotating) {
            this.toggleAutoRotate();
        }
    },

    /**
     * Mouse drag move
     */
    onDragMove(e) {
        if (!this.state.isDragging) return;

        const deltaX = e.clientX - this.state.lastX;

        // Calculate velocity for momentum
        this.state.velocity = deltaX;

        // Update angle based on drag distance
        const angleChange = (deltaX / ROTATION_CONFIG.dragSensitivity) *
                           ROTATION_CONFIG.angleStep *
                           ROTATION_CONFIG.rotationDirection;

        this.state.currentAngle += angleChange;
        this.state.lastX = e.clientX;

        // Update image
        this.updateAngleIndex();
        this.updateImage();
    },

    /**
     * Mouse drag end
     */
    onDragEnd(e) {
        if (!this.state.isDragging) return;

        this.state.isDragging = false;
        this.elements.container.style.cursor = 'grab';

        // Apply momentum if enabled
        if (ROTATION_CONFIG.enableMomentum &&
            Math.abs(this.state.velocity) > ROTATION_CONFIG.minMomentumVelocity) {
            // Velocity will be handled in animation loop
        } else {
            this.state.velocity = 0;
        }
    },

    /**
     * Touch start (mobile)
     */
    onTouchStart(e) {
        if (e.touches.length !== 1) return;

        // Don't start rotation drag if touching comparison slider handle
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.closest('#comparison-slider-handle')) {
            return;
        }

        e.preventDefault();
        this.state.isDragging = true;
        this.state.startX = touch.clientX;
        this.state.lastX = touch.clientX;
        this.state.velocity = 0;
    },

    /**
     * Touch move (mobile)
     */
    onTouchMove(e) {
        if (!this.state.isDragging || e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.state.lastX;

        this.state.velocity = deltaX;

        const angleChange = (deltaX / ROTATION_CONFIG.dragSensitivity) *
                           ROTATION_CONFIG.angleStep *
                           ROTATION_CONFIG.rotationDirection;

        this.state.currentAngle += angleChange;
        this.state.lastX = touch.clientX;

        this.updateAngleIndex();
        this.updateImage();
    },

    /**
     * Touch end (mobile)
     */
    onTouchEnd(e) {
        if (!this.state.isDragging) return;

        this.state.isDragging = false;

        if (ROTATION_CONFIG.enableMomentum &&
            Math.abs(this.state.velocity) > ROTATION_CONFIG.minMomentumVelocity) {
            // Velocity will be handled in animation loop
        } else {
            this.state.velocity = 0;
        }
    },

    /**
     * Update the current angle index based on current angle
     */
    updateAngleIndex() {
        this.state.currentAngleIndex = ROTATION_CONFIG.getAngleIndex(this.state.currentAngle);
    },

    /**
     * Update the displayed image based on current state
     */
    updateImage() {
        if (!app.state.ethnicity || !app.state.hairType) {
            console.warn('Ethnicity or hair type not selected');
            return;
        }

        // Check if we should use comparison slider
        console.log('[Rotation] Checking comparison mode:', {
            hasComparisonSlider: !!window.ComparisonSlider,
            ethnicity: app.state.ethnicity,
            hairType: app.state.hairType,
            projectionYears: app.state.projectionYears,
            age: app.state.age
        });

        const useComparison = window.ComparisonSlider &&
                              ComparisonSlider.shouldShowComparison(app.state.ethnicity, app.state.hairType);

        console.log('[Rotation] useComparison =', useComparison, 'projectionYears =', app.state.projectionYears);

        if (useComparison) {
            // Hide regular image, show comparison slider
            this.elements.image.style.display = 'none';
            ComparisonSlider.show();
            ComparisonSlider.updateImages(this.state.currentAngleIndex);
        } else {
            // Show regular image, hide comparison slider
            this.elements.image.style.display = 'block';
            if (window.ComparisonSlider) {
                ComparisonSlider.hide();
            }

            // Calculate current gray percentage
            const params = {
                ethnicity: app.state.ethnicity,
                age: app.state.age,
                projectionYears: app.state.projectionYears,
                ...app.state.parameters
            };

            const result = Calculator.calculateGrayPercentage(params);
            // If using Elixr and it's N/A, fall back to without Elixr value
            let displayPercent = app.state.usingElixr ? result.withElixr : result.withoutElixr;
            if (displayPercent === 'N/A') {
                displayPercent = result.withoutElixr;
            }

            console.log('[Rotation] Updating image:', {
                ethnicity: app.state.ethnicity,
                hairType: app.state.hairType,
                gender: this.state.gender,
                angleIndex: this.state.currentAngleIndex,
                grayPercent: displayPercent
            });

            // Get image path
            const imagePath = ROTATION_CONFIG.getImagePath(
                app.state.ethnicity,
                app.state.hairType,
                this.state.gender,
                this.state.currentAngleIndex,
                displayPercent
            );

            console.log('[Rotation] Loading image:', imagePath);

            // Update image
            this.elements.image.src = imagePath;
            this.elements.image.alt = `${CONFIG.ethnicities[app.state.ethnicity].name} ${this.state.gender} - ${displayPercent}% gray - ${this.state.currentAngleIndex * ROTATION_CONFIG.angleStep}° view`;

            // Handle image error (show placeholder)
            this.elements.image.onerror = () => {
                console.error('[Rotation] Failed to load image:', imagePath);
                console.log('[Rotation] Showing placeholder instead');
                this.elements.image.src = this.createPlaceholder(
                    this.state.currentAngleIndex,
                    displayPercent
                );
            };

            // Log successful image load
            this.elements.image.onload = () => {
                console.log('[Rotation] Image loaded successfully');
            };
        }

        // Update angle display (common for both modes)
        const angleDisplay = document.getElementById('rotation-angle-display');
        if (angleDisplay) {
            const displayAngle = this.state.currentAngleIndex * ROTATION_CONFIG.angleStep;
            angleDisplay.textContent = `${displayAngle}°`;
        }
    },

    /**
     * Create a placeholder image for missing images
     */
    createPlaceholder(angleIndex, grayPercent) {
        const angle = angleIndex * ROTATION_CONFIG.angleStep;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <rect width="600" height="600" fill="${ROTATION_CONFIG.images.placeholderColor}"/>

                <!-- Angle indicator circle -->
                <circle cx="300" cy="300" r="200" fill="none" stroke="#cbd5e0" stroke-width="2" stroke-dasharray="5,5"/>

                <!-- Rotation direction arrow -->
                <line x1="300" y1="300" x2="${300 + 180 * Math.cos(angle * Math.PI / 180)}" y2="${300 + 180 * Math.sin(angle * Math.PI / 180)}" stroke="#4a5568" stroke-width="3"/>
                <circle cx="${300 + 180 * Math.cos(angle * Math.PI / 180)}" cy="${300 + 180 * Math.sin(angle * Math.PI / 180)}" r="8" fill="#4a5568"/>

                <!-- Central info -->
                <text x="300" y="280" text-anchor="middle" font-family="Arial" font-size="48" fill="#2d3748" font-weight="bold">
                    ${angle}°
                </text>
                <text x="300" y="320" text-anchor="middle" font-family="Arial" font-size="24" fill="#4a5568">
                    ${grayPercent}% Gray
                </text>
                <text x="300" y="355" text-anchor="middle" font-family="Arial" font-size="18" fill="#718096">
                    ${CONFIG.ethnicities[app.state.ethnicity]?.name || 'Unknown'}
                </text>
                <text x="300" y="385" text-anchor="middle" font-family="Arial" font-size="18" fill="#718096">
                    ${CONFIG.hairTypes[app.state.hairType] || 'Unknown'} - ${this.state.gender}
                </text>

                <!-- Instruction -->
                <text x="300" y="520" text-anchor="middle" font-family="Arial" font-size="16" fill="#a0aec0">
                    Drag to rotate
                </text>
            </svg>
        `;

        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    },

    /**
     * Switch gender
     */
    setGender(gender) {
        if (gender !== 'male' && gender !== 'female') {
            console.error('Invalid gender:', gender);
            return;
        }

        this.state.gender = gender;
        console.log('Gender changed to:', gender);

        // Update gender toggle buttons
        this.updateGenderToggle();

        // Update image
        this.updateImage();

        // Preload images for new gender
        if (ROTATION_CONFIG.preloadImages && window.ImagePreloader) {
            ImagePreloader.preloadGenderImages(gender);
        }
    },

    /**
     * Update gender toggle button states
     */
    updateGenderToggle() {
        const maleBtn = document.getElementById('gender-male');
        const femaleBtn = document.getElementById('gender-female');

        if (!maleBtn || !femaleBtn) return;

        if (this.state.gender === 'male') {
            maleBtn.classList.add('active');
            femaleBtn.classList.remove('active');
        } else {
            maleBtn.classList.remove('active');
            femaleBtn.classList.add('active');
        }
    },

    /**
     * Toggle auto-rotation on/off
     */
    toggleAutoRotate() {
        this.state.isAutoRotating = !this.state.isAutoRotating;
        console.log('Auto-rotation:', this.state.isAutoRotating ? 'ON' : 'OFF');

        // Update button state
        const rotateBtn = document.querySelector('.view-tab[data-view="rotate"]');
        if (rotateBtn) {
            if (this.state.isAutoRotating) {
                rotateBtn.classList.add('auto-rotating');
                rotateBtn.innerHTML = '360° Rotating...';
            } else {
                rotateBtn.classList.remove('auto-rotating');
                rotateBtn.innerHTML = '360° Rotate';
            }
        }

        return this.state.isAutoRotating;
    },

    /**
     * Animation loop for momentum and smooth updates
     */
    startAnimationLoop() {
        const animate = () => {
            // Auto-rotation takes priority
            if (this.state.isAutoRotating && !this.state.isDragging) {
                this.state.currentAngle += this.state.autoRotateSpeed;
                const newAngleIndex = ROTATION_CONFIG.getAngleIndex(this.state.currentAngle);
                if (newAngleIndex !== this.state.currentAngleIndex) {
                    this.state.currentAngleIndex = newAngleIndex;
                    this.updateImage();
                }
            }
            // Apply momentum decay
            else if (!this.state.isDragging && Math.abs(this.state.velocity) > 0.1) {
                const angleChange = (this.state.velocity / ROTATION_CONFIG.dragSensitivity) *
                                   ROTATION_CONFIG.angleStep *
                                   ROTATION_CONFIG.rotationDirection;

                this.state.currentAngle += angleChange;
                this.state.velocity *= ROTATION_CONFIG.momentumFriction;

                // Update image if angle changed enough
                const newAngleIndex = ROTATION_CONFIG.getAngleIndex(this.state.currentAngle);
                if (newAngleIndex !== this.state.currentAngleIndex) {
                    this.state.currentAngleIndex = newAngleIndex;
                    this.updateImage();
                }
            } else if (!this.state.isDragging) {
                this.state.velocity = 0;
            }

            this.state.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    },

    /**
     * Reset rotation to front view
     */
    reset() {
        this.state.currentAngle = 0;
        this.state.currentAngleIndex = 0;
        this.state.velocity = 0;
        this.updateImage();
    },

    /**
     * Clean up (stop animation loop)
     */
    destroy() {
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }
    }
};
