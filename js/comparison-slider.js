// Comparison Slider Logic for Before/After Treatment Comparison
console.log('[ComparisonSlider] Script loaded');

const ComparisonSlider = {
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
        this.elements.beforeWrapper = document.querySelector('.comparison-image-wrapper:first-child');
        this.elements.afterWrapper = document.getElementById('comparison-after-wrapper');
        this.elements.beforeImage = document.getElementById('comparison-before-image');
        this.elements.afterImage = document.getElementById('comparison-after-image');

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

        // Update handle position
        this.elements.sliderHandle.style.left = `${percentage}%`;

        // Update clip paths on both wrappers
        // Before wrapper: show left side (clip from right)
        this.elements.beforeWrapper.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;

        // After wrapper: show right side (clip from left)
        this.elements.afterWrapper.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    },

    /**
     * Show comparison slider mode
     */
    show() {
        this.state.isActive = true;
        this.elements.container.style.display = 'block';
        console.log('Comparison slider shown');
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
        const shouldShow = ethnicity === 'caucasian' && hairType === 'straight-short';
        console.log('[ComparisonSlider] shouldShowComparison:', {
            ethnicity,
            hairType,
            shouldShow
        });
        return shouldShow;
    },

    /**
     * Update comparison images for specific angle
     */
    updateImages(angleIndex) {
        if (!this.state.isActive) return;

        this.state.currentAngleIndex = angleIndex;

        // Get the actual angle from the index
        const angle = angleIndex * ROTATION_CONFIG.angleStep;

        // Path to dark (without treatment) images
        const darkPath = `40yo caucasian dark/${angle}.png`;

        // Path to silver (with treatment) images
        const silverPath = `40yo caucasian silver/${angle}.png`;

        console.log('[ComparisonSlider] Updating images:', {
            angle: angle,
            darkPath: darkPath,
            silverPath: silverPath
        });

        // Update images
        this.elements.beforeImage.src = darkPath;
        this.elements.beforeImage.alt = `Without Treatment - ${angle}° view`;

        this.elements.afterImage.src = silverPath;
        this.elements.afterImage.alt = `With Treatment - ${angle}° view`;

        // Handle image errors
        this.elements.beforeImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load before image:', darkPath);
        };

        this.elements.afterImage.onerror = () => {
            console.error('[ComparisonSlider] Failed to load after image:', silverPath);
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
