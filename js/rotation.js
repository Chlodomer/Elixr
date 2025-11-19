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

        // COMPARISON SLIDER IMPLEMENTATION:
        // 0 years (Now) -> dark images only (no comparison)
        // 10 years -> comparison: silver (with Elixr) vs white (without Elixr)
        // 20 years -> comparison: silver (with Elixr) vs white (without Elixr)

        const years = app.state.projectionYears;

        // At "Now" (0 years), show single dark image - no comparison
        if (years === 0) {
            if (window.ComparisonSlider) {
                ComparisonSlider.hide();
            }
            this.elements.image.style.display = 'block';
            const folderName = '40yo%20caucasian%20dark';
            this.tryLoadImageAtAngle(folderName, this.state.currentAngleIndex, 0);
            return;
        }

        // At 10 or 20 years, show comparison slider
        if (years === 10 || years === 20) {
            this.elements.image.style.display = 'none';

            if (window.ComparisonSlider) {
                // With Elixr: silver hair (reduced graying)
                // Without Elixr: white hair (natural progression)
                const withElixrFolder = '40yo%20caucasian%20silver';
                const withoutElixrFolder = '40yo%20caucasian%20white';

                this.tryLoadComparisonImages(withElixrFolder, withoutElixrFolder, this.state.currentAngleIndex, 0);
            }
            return;
        }

        // Fallback for any other projection years
        if (window.ComparisonSlider) {
            ComparisonSlider.hide();
        }
        this.elements.image.style.display = 'block';
        this.tryLoadImageAtAngle('40yo%20caucasian%20dark', this.state.currentAngleIndex, 0);
    },

    /**
     * Try to load comparison images at a specific angle, skip to next if not found
     */
    tryLoadComparisonImages(withElixrFolder, withoutElixrFolder, angleIndex, attempts) {
        // Prevent infinite loop - max 24 attempts (full circle)
        if (attempts >= ROTATION_CONFIG.totalAngles) {
            console.error('[Rotation] No comparison images found');
            return;
        }

        const angle = angleIndex * ROTATION_CONFIG.angleStep;
        const withElixrPath = `${withElixrFolder}/${angle}.png`;
        const withoutElixrPath = `${withoutElixrFolder}/${angle}.png`;

        console.log(`[Rotation] Trying comparison at ${angle}° (attempt ${attempts + 1})`);

        // Test if both images exist
        const testWithElixr = new Image();
        const testWithoutElixr = new Image();
        let withElixrLoaded = false;
        let withoutElixrLoaded = false;

        const checkBothLoaded = () => {
            if (withElixrLoaded && withoutElixrLoaded) {
                // Both images loaded successfully, show comparison slider
                if (window.ComparisonSlider) {
                    ComparisonSlider.show(withElixrPath, withoutElixrPath, angle);
                }
            }
        };

        testWithElixr.onload = () => {
            withElixrLoaded = true;
            checkBothLoaded();
        };

        testWithElixr.onerror = () => {
            // With Elixr image failed, try next angle
            console.log(`[Rotation] Missing with Elixr at ${angle}°, trying next...`);
            const nextAngleIndex = (angleIndex + 1) % ROTATION_CONFIG.totalAngles;
            this.tryLoadComparisonImages(withElixrFolder, withoutElixrFolder, nextAngleIndex, attempts + 1);
        };

        testWithoutElixr.onload = () => {
            withoutElixrLoaded = true;
            checkBothLoaded();
        };

        testWithoutElixr.onerror = () => {
            // Without Elixr image failed, try next angle
            console.log(`[Rotation] Missing without Elixr at ${angle}°, trying next...`);
            const nextAngleIndex = (angleIndex + 1) % ROTATION_CONFIG.totalAngles;
            this.tryLoadComparisonImages(withElixrFolder, withoutElixrFolder, nextAngleIndex, attempts + 1);
        };

        testWithElixr.src = withElixrPath;
        testWithoutElixr.src = withoutElixrPath;
    },

    /**
     * Try to load an image at a specific angle, skip to next if not found
     */
    tryLoadImageAtAngle(folderName, angleIndex, attempts) {
        // Prevent infinite loop - max 24 attempts (full circle)
        if (attempts >= ROTATION_CONFIG.totalAngles) {
            console.error('[Rotation] No images found in folder:', folderName);
            return;
        }

        const angle = angleIndex * ROTATION_CONFIG.angleStep;
        const imagePath = `${folderName}/${angle}.png`;

        console.log(`[Rotation] Trying: ${app.state.projectionYears}yr → ${angle}.png (attempt ${attempts + 1})`);

        // Create a temporary image to test if it loads
        const testImg = new Image();

        testImg.onload = () => {
            // Image loaded successfully, display it
            this.elements.image.src = imagePath;
            this.elements.image.alt = `Projection ${app.state.projectionYears} years - ${angle}° view`;

            // Update angle display
            const angleDisplay = document.getElementById('rotation-angle-display');
            if (angleDisplay) {
                angleDisplay.textContent = `${angle}°`;
            }
        };

        testImg.onerror = () => {
            // Image failed to load, try next angle
            console.log(`[Rotation] Missing: ${angle}.png, trying next...`);
            const nextAngleIndex = (angleIndex + 1) % ROTATION_CONFIG.totalAngles;
            this.tryLoadImageAtAngle(folderName, nextAngleIndex, attempts + 1);
        };

        testImg.src = imagePath;
    },

    /**
     * Create a placeholder image for missing images
     */
    createPlaceholder(angleIndex, projectionYears) {
        const angle = angleIndex * ROTATION_CONFIG.angleStep;

        // Determine stage label
        let stage = 'Dark Hair';
        if (projectionYears === 10) stage = 'Silver Hair';
        else if (projectionYears === 20) stage = 'White Hair';

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <rect width="600" height="600" fill="#2a2a2a"/>

                <!-- Angle indicator circle -->
                <circle cx="300" cy="300" r="200" fill="none" stroke="#4a5568" stroke-width="2" stroke-dasharray="5,5"/>

                <!-- Rotation direction arrow -->
                <line x1="300" y1="300" x2="${300 + 180 * Math.cos(angle * Math.PI / 180)}" y2="${300 + 180 * Math.sin(angle * Math.PI / 180)}" stroke="#6a7a8a" stroke-width="3"/>
                <circle cx="${300 + 180 * Math.cos(angle * Math.PI / 180)}" cy="${300 + 180 * Math.sin(angle * Math.PI / 180)}" r="8" fill="#6a7a8a"/>

                <!-- Central info -->
                <text x="300" y="270" text-anchor="middle" font-family="Arial" font-size="48" fill="#e0e0e0" font-weight="bold">
                    ${angle}°
                </text>
                <text x="300" y="310" text-anchor="middle" font-family="Arial" font-size="24" fill="#b0b0b0">
                    ${projectionYears} Years
                </text>
                <text x="300" y="345" text-anchor="middle" font-family="Arial" font-size="20" fill="#8a9aa0">
                    ${stage}
                </text>
                <text x="300" y="380" text-anchor="middle" font-family="Arial" font-size="16" fill="#6a7a8a">
                    Image not found
                </text>

                <!-- Instruction -->
                <text x="300" y="520" text-anchor="middle" font-family="Arial" font-size="16" fill="#6a7a8a">
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
