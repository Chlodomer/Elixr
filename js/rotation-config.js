// Rotation Configuration
// Easy to expand: Change totalAngles to 12, 16, 24, etc. and everything adapts

const ROTATION_CONFIG = {
    // Number of pre-rendered angles (8 for MVP, expandable to 12, 16, 24, etc.)
    totalAngles: 8,

    // Calculate angle step automatically (360° / totalAngles)
    get angleStep() {
        return 360 / this.totalAngles;
    },

    // Starting angle (0 = front view)
    startAngle: 0,

    // Drag sensitivity (pixels needed to rotate one angle step)
    // v2.0: Reduced from 30 to 15 for faster, more responsive rotation
    dragSensitivity: 15,

    // Rotation direction (1 = clockwise, -1 = counter-clockwise)
    rotationDirection: 1,

    // Enable momentum/inertia after drag release
    enableMomentum: true,

    // Friction for momentum decay (0-1, higher = slower decay)
    // v2.0: Reduced from 0.92 to 0.88 for snappier response
    momentumFriction: 0.88,

    // Minimum velocity to trigger momentum
    // v2.0: Reduced from 0.5 to 0.3 for easier momentum activation
    minMomentumVelocity: 0.3,

    // Touch/Mobile support
    enableTouch: true,

    // Image preloading
    preloadImages: true,

    // Image paths configuration
    images: {
        // Base path for rotation images
        basePath: 'images/rotation',

        // Naming convention: {ethnicity}/{hairType}/{gender}/{angle}-{grayLevel}.jpg
        // Example: caucasian/straight-short/male/0-50.jpg

        // Available options
        ethnicities: ['caucasian', 'african-american', 'middle-eastern'],
        hairTypes: ['straight-short', 'straight-long', 'curly-short', 'curly-long'],
        genders: ['male', 'female'],
        grayLevels: [0, 25, 50, 75, 100],

        // Angle naming (matches totalAngles)
        get angles() {
            const angles = [];
            const step = 360 / ROTATION_CONFIG.totalAngles;
            for (let i = 0; i < ROTATION_CONFIG.totalAngles; i++) {
                angles.push(i * step);
            }
            return angles;
        },

        // Fallback placeholder color
        placeholderColor: '#e2e8f0'
    },

    /**
     * Get the closest angle index for a given rotation angle
     * @param {number} angle - The current rotation angle in degrees (0-360)
     * @returns {number} - The index of the closest pre-rendered angle (0 to totalAngles-1)
     */
    getAngleIndex(angle) {
        // Normalize angle to 0-360
        const normalizedAngle = ((angle % 360) + 360) % 360;

        // Calculate which frame is closest
        const index = Math.round(normalizedAngle / this.angleStep) % this.totalAngles;

        return index;
    },

    /**
     * Get the image path for specific parameters
     * @param {string} ethnicity - Ethnicity type
     * @param {string} hairType - Hair type
     * @param {string} gender - Gender (male/female)
     * @param {number} angleIndex - Angle index (0 to totalAngles-1)
     * @param {number} grayPercent - Gray percentage (0-100)
     * @returns {string} - Full image path
     */
    getImagePath(ethnicity, hairType, gender, angleIndex, grayPercent) {
        // Map gray percentage to closest gray level
        const grayLevel = this._getClosestGrayLevel(grayPercent);

        // Get actual angle from index
        const angle = angleIndex * this.angleStep;

        // Determine file extension based on availability of real photos
        // Caucasian male with straight-short hair uses real PNG photos
        let extension = '.svg'; // Default to SVG placeholders

        if (ethnicity === 'caucasian' && hairType === 'straight-short' && gender === 'male') {
            extension = '.png'; // Use real photos for caucasian male
        }

        // Build path: images/rotation/{ethnicity}/{hairType}/{gender}/{angle}-{grayLevel}.{ext}
        return `${this.images.basePath}/${ethnicity}/${hairType}/${gender}/${angle}-${grayLevel}${extension}`;
    },

    /**
     * Get the closest gray level from available options
     * @param {number} percent - Gray percentage (0-100)
     * @returns {number} - Closest gray level (0, 25, 50, 75, 100)
     */
    _getClosestGrayLevel(percent) {
        const levels = this.images.grayLevels;
        return levels.reduce((prev, curr) => {
            return (Math.abs(curr - percent) < Math.abs(prev - percent) ? curr : prev);
        });
    },

    /**
     * Calculate total number of images needed
     * @returns {number} - Total image count
     */
    getTotalImageCount() {
        return this.totalAngles *
               this.images.ethnicities.length *
               this.images.hairTypes.length *
               this.images.genders.length *
               this.images.grayLevels.length;
    }
};

// Log configuration on load
console.log('Rotation Configuration:');
console.log(`- Total Angles: ${ROTATION_CONFIG.totalAngles}`);
console.log(`- Angle Step: ${ROTATION_CONFIG.angleStep}°`);
console.log(`- Total Images Needed: ${ROTATION_CONFIG.getTotalImageCount()}`);
console.log(`- Angles: ${ROTATION_CONFIG.images.angles.join('°, ')}°`);
