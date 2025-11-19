// Comparison Slider Logic for Before/After Treatment Comparison
console.log('[ComparisonSlider] Script loaded');

const ComparisonSlider = {
    // Available angles for comparison images (must match actual image files)
    availableAngles: [0, 30, 60, 90, 180, 270, 330],

    // Current state
    state: {
        isActive: false,           // Is comparison mode active
        isDragging: false,         // Is user currently dragging the slider
        sliderPosition: 50,        // Slider position as percentage (0-100)
        currentAngleIndex: 0       // Current rotation angle index
    },

    // Reference to DOM elements
    elements: {
        container: null,
        sliderHandle: null,
        beforeWrapper: null,
        afterWrapper: null,
        beforeImage: null,
        afterImage: null
    },

    /**
     * Initialize the comparison slider
     */
    init() {
        console.log('Initializing comparison slider...');

        // Get DOM references
        this.elements.container = document.getElementById('comparison-slider-container');
        this.elements.sliderHandle = document.getElementById('comparison-slider-handle');
        this.elements.beforeImage = document.getElementById('comparison-before-image');
        this.elements.afterImage = document.getElementById('comparison-after-image');
        this.elements.beforeWrapper = this.elements.beforeImage?.parentElement;
        this.elements.afterWrapper = this.elements.afterImage?.parentElement;

        if (!this.elements.container || !this.elements.sliderHandle) {
            console.error('Comparison slider elements not found');
            return;
        }

        // Set up event listeners
        this.setupEventListeners();

        console.log('Comparison slider initialized');
    },

    /**
     * Set up mouse and touch event listeners for the slider
     */
    setupEventListeners() {
        const handle = this.elements.sliderHandle;
        const container = this.elements.container;

        // Mouse events
        handle.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));

        // Touch events (mobile)
        handle.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Click on container to jump slider to that position
        container.addEventListener('click', this.onContainerClick.bind(this));
    },

    /**
     * Mouse drag start
     */
    onDragStart(e) {
        e.preventDefault();
        this.state.isDragging = true;
    },

    /**
     * Mouse drag move
     */
    onDragMove(e) {
        if (!this.state.isDragging) return;

        this.updateSliderPosition(e.clientX);
    },

    /**
     * Mouse drag end
     */
    onDragEnd(e) {
        this.state.isDragging = false;
    },

    /**
     * Touch start (mobile)
     */
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length !== 1) return;

        this.state.isDragging = true;
    },

    /**
     * Touch move (mobile)
     */
    onTouchMove(e) {
        if (!this.state.isDragging || e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        this.updateSliderPosition(touch.clientX);
    },

    /**
     * Touch end (mobile)
     */
    onTouchEnd(e) {
        this.state.isDragging = false;
    },

    /**
     * Click on container to jump slider
     */
    onContainerClick(e) {
        // Don't trigger if clicking on the handle itself
        if (e.target.closest('#comparison-slider-handle')) return;

        this.updateSliderPosition(e.clientX);
    },

    /**
     * Update slider position based on mouse/touch X coordinate
     */
    updateSliderPosition(clientX) {
        const containerRect = this.elements.container.getBoundingClientRect();
        const x = clientX - containerRect.left;
        const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));

        this.state.sliderPosition = percentage;
        this.updateSliderUI();
    },

    /**
     * Update the slider UI based on current position
     */
    updateSliderUI() {
        const percentage = this.state.sliderPosition;

        console.log('[ComparisonSlider] updateSliderUI called with percentage:', percentage);

        // Update handle position
        this.elements.sliderHandle.style.left = `${percentage}%`;

        // Apply clip-path directly to images, not wrappers
        // Before image (with Elixr): show left side (clip from right)
        const beforeClipPath = `inset(0 ${100 - percentage}% 0 0)`;
        // After image (without Elixr): show right side (clip from left)
        const afterClipPath = `inset(0 0 0 ${percentage}%)`;

        console.log('[ComparisonSlider] Setting beforeImage clipPath to:', beforeClipPath);
        console.log('[ComparisonSlider] Setting afterImage clipPath to:', afterClipPath);

        this.elements.beforeImage.style.clipPath = beforeClipPath;
        this.elements.afterImage.style.clipPath = afterClipPath;

        console.log('[ComparisonSlider] Actual beforeImage clipPath:', this.elements.beforeImage.style.clipPath);
        console.log('[ComparisonSlider] Actual afterImage clipPath:', this.elements.afterImage.style.clipPath);
    },

    /**
     * Show comparison slider mode with specific images
     */
    show(withElixrPath, withoutElixrPath, angle) {
        console.log('[ComparisonSlider] show() called');
        console.log('[ComparisonSlider] Elements check:', {
            container: !!this.elements.container,
            beforeImage: !!this.elements.beforeImage,
            afterImage: !!this.elements.afterImage
        });

        if (!this.elements.container || !this.elements.beforeImage || !this.elements.afterImage) {
            console.error('[ComparisonSlider] Elements not initialized! Calling init()...');
            this.init();

            // After init, verify elements were found
            if (!this.elements.beforeImage || !this.elements.afterImage) {
                console.error('[ComparisonSlider] Failed to initialize elements!');
                return;
            }
        }

        this.state.isActive = true;
        this.elements.container.style.display = 'flex';

        console.log('[ComparisonSlider] Showing comparison:', {
            withElixr: withElixrPath,
            withoutElixr: withoutElixrPath,
            angle: angle
        });

        // Update images
        this.elements.beforeImage.src = withElixrPath;
        this.elements.beforeImage.alt = `With Elixr - ${angle}° view`;

        this.elements.afterImage.src = withoutElixrPath;
        this.elements.afterImage.alt = `Without Elixr - ${angle}° view`;

        // Handle image errors
        this.elements.beforeImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load with Elixr image:', withElixrPath);
        };

        this.elements.afterImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load without Elixr image:', withoutElixrPath);
        };

        // Log when images successfully load
        this.elements.beforeImage.onload = () => {
            console.log('[ComparisonSlider] With Elixr image loaded successfully');
        };

        this.elements.afterImage.onload = () => {
            console.log('[ComparisonSlider] Without Elixr image loaded successfully');
        };

        // Reset to center position first
        this.state.sliderPosition = 50;

        // Ensure slider UI is properly initialized
        this.updateSliderUI();

        console.log('Comparison slider shown, container display:', this.elements.container.style.display);
    },

    /**
     * Hide comparison slider mode
     */
    hide() {
        this.state.isActive = false;
        this.elements.container.style.display = 'none';
        console.log('Comparison slider hidden');
    },

    /**
     * Check if comparison mode should be active for current selection
     */
    shouldShowComparison(ethnicity, hairType) {
        // Only show for caucasian straight-short (where we have real photos)
        // AND only when viewing 10 or 20 years projection
        const projectionYears = app.state.projectionYears;

        console.log('[ComparisonSlider] shouldShowComparison DEBUG:', {
            ethnicity,
            'ethnicity === "caucasian"': ethnicity === 'caucasian',
            hairType,
            'hairType === "straight-short"': hairType === 'straight-short',
            projectionYears,
            'typeof projectionYears': typeof projectionYears,
            'projectionYears === 10': projectionYears === 10,
            'projectionYears === 20': projectionYears === 20
        });

        const shouldShow = ethnicity === 'caucasian' &&
            hairType === 'straight-short' &&
            (projectionYears === 10 || projectionYears === 20);

        console.log('[ComparisonSlider] shouldShowComparison:', {
            ethnicity,
            hairType,
            projectionYears,
            shouldShow
        });
        return shouldShow;
    },

    /**
     * Get the closest available angle for a given rotation angle index
     */
    getClosestAvailableAngle(angleIndex) {
        // Calculate the actual rotation angle from the index
        const rotationAngle = angleIndex * ROTATION_CONFIG.angleStep;

        // Find the closest available angle
        let closestAngle = this.availableAngles[0];
        let minDiff = Math.abs(rotationAngle - closestAngle);

        for (const angle of this.availableAngles) {
            const diff = Math.abs(rotationAngle - angle);
            if (diff < minDiff) {
                minDiff = diff;
                closestAngle = angle;
            }
        }

        return closestAngle;
    },

    /**
     * Update comparison images for specific angle
     */
    updateImages(angleIndex) {
        if (!this.state.isActive) return;

        this.state.currentAngleIndex = angleIndex;

        // Get the closest available angle
        const angle = this.getClosestAvailableAngle(angleIndex);

        // Determine paths based on projection years
        let beforePath, afterPath;
        const projectionYears = app.state.projectionYears;

        if (projectionYears === 10) {
            // 10 years projection: Dark (Now) vs Silver (10y)
            beforePath = `40yo%20caucasian%20dark/${angle}.png`;
            afterPath = `40yo%20caucasian%20silver/${angle}.png`;
        } else if (projectionYears === 20) {
            // 20 years projection: Silver (With Elixr) vs White (Without Elixr)
            beforePath = `40yo%20caucasian%20silver/${angle}.png`;
            afterPath = `40yo%20caucasian%20white/${angle}.png`;
        } else {
            // Fallback or error case
            console.warn('[ComparisonSlider] Unexpected projection years for comparison:', projectionYears);
            return;
        }

        const debugLog = (msg) => {
            const el = document.getElementById('debug-overlay');
            if (el) el.innerHTML += `<div>${msg}</div>`;
        };
        debugLog(`[Slider] Update: Before=${beforePath}, After=${afterPath}`);

        console.log('[ComparisonSlider] Updating images:', {
            angleIndex: angleIndex,
            rotationAngle: angleIndex * ROTATION_CONFIG.angleStep,
            closestAvailableAngle: angle,
            projectionYears: projectionYears,
            beforePath: beforePath,
            afterPath: afterPath
        });

        // Update images
        this.elements.beforeImage.src = beforePath;
        this.elements.beforeImage.alt = `With Elixr - ${angle}° view`;

        this.elements.afterImage.src = afterPath;
        this.elements.afterImage.alt = `Without Elixr - ${angle}° view`;

        // Handle image errors
        this.elements.beforeImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load before image:', beforePath);
        };

        this.elements.afterImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load after image:', afterPath);
        };

        // Log successful loads
        this.elements.beforeImage.onload = () => {
            console.log('[ComparisonSlider] Before image loaded successfully');
        };

        this.elements.afterImage.onload = () => {
            console.log('[ComparisonSlider] After image loaded successfully');
        };
    },

    /**
     * Reset slider to center position
     */
    reset() {
        this.state.sliderPosition = 50;
        this.updateSliderUI();
    }
};

// Expose to global window object
window.ComparisonSlider = ComparisonSlider;
