// Image Preloader for Smooth Rotation

const ImagePreloader = {
    // Cache of loaded images
    cache: new Map(),

    // Loading state
    state: {
        isPreloading: false,
        preloadProgress: 0,
        totalImages: 0,
        loadedImages: 0
    },

    /**
     * Preload all rotation images for current selection
     * @param {string} ethnicity - Ethnicity type
     * @param {string} hairType - Hair type
     * @param {number} grayPercent - Gray percentage
     */
    preloadCurrentSet(ethnicity, hairType, grayPercent) {
        if (!ROTATION_CONFIG.preloadImages) return;

        console.log('Preloading images for:', { ethnicity, hairType, grayPercent });

        this.state.isPreloading = true;
        this.state.loadedImages = 0;

        // Preload both genders
        const imagesToLoad = [];

        ROTATION_CONFIG.images.genders.forEach(gender => {
            for (let angleIndex = 0; angleIndex < ROTATION_CONFIG.totalAngles; angleIndex++) {
                const imagePath = ROTATION_CONFIG.getImagePath(
                    ethnicity,
                    hairType,
                    gender,
                    angleIndex,
                    grayPercent
                );

                imagesToLoad.push({ path: imagePath, gender, angleIndex });
            }
        });

        this.state.totalImages = imagesToLoad.length;

        // Load images in parallel
        const loadPromises = imagesToLoad.map(imageData =>
            this.loadImage(imageData.path)
                .then(() => {
                    this.state.loadedImages++;
                    this.state.preloadProgress = (this.state.loadedImages / this.state.totalImages) * 100;
                    this.updateProgressUI();
                })
                .catch(err => {
                    console.warn(`Failed to preload ${imageData.path}:`, err);
                    this.state.loadedImages++; // Still count it to move progress forward
                })
        );

        Promise.all(loadPromises).then(() => {
            console.log(`Preloaded ${this.state.loadedImages}/${this.state.totalImages} images`);
            this.state.isPreloading = false;
            this.hideProgressUI();
        });
    },

    /**
     * Preload images for a specific gender (when switching genders)
     * @param {string} gender - Gender to preload
     */
    preloadGenderImages(gender) {
        if (!ROTATION_CONFIG.preloadImages) return;
        if (!app.state.ethnicity || !app.state.hairType) return;

        const params = {
            ethnicity: app.state.ethnicity,
            age: app.state.age,
            projectionYears: app.state.projectionYears,
            gender: app.state.gender,
            ...app.state.parameters
        };

        const result = Calculator.calculateGrayPercentage(params);
        let displayPercent = app.state.usingElixr ? result.withElixr : result.withoutElixr;
        if (displayPercent === 'N/A') {
            displayPercent = result.withoutElixr;
        }

        console.log(`Preloading ${gender} images...`);

        const imagesToLoad = [];

        for (let angleIndex = 0; angleIndex < ROTATION_CONFIG.totalAngles; angleIndex++) {
            const imagePath = ROTATION_CONFIG.getImagePath(
                app.state.ethnicity,
                app.state.hairType,
                gender,
                angleIndex,
                displayPercent
            );

            imagesToLoad.push(imagePath);
        }

        imagesToLoad.forEach(path => {
            this.loadImage(path).catch(err => {
                console.warn(`Failed to preload ${path}:`, err);
            });
        });
    },

    /**
     * Load a single image and add to cache
     * @param {string} path - Image path
     * @returns {Promise} - Resolves when image loads
     */
    loadImage(path) {
        // Check if already in cache
        if (this.cache.has(path)) {
            return Promise.resolve(this.cache.get(path));
        }

        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.cache.set(path, img);
                resolve(img);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${path}`));
            };

            img.src = path;
        });
    },

    /**
     * Update progress UI
     */
    updateProgressUI() {
        const progressBar = document.getElementById('preload-progress-bar');
        const progressText = document.getElementById('preload-progress-text');

        if (progressBar) {
            progressBar.style.width = `${this.state.preloadProgress}%`;
        }

        if (progressText) {
            progressText.textContent = `Loading images: ${Math.round(this.state.preloadProgress)}%`;
        }
    },

    /**
     * Show progress UI
     */
    showProgressUI() {
        const progressContainer = document.getElementById('preload-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
    },

    /**
     * Hide progress UI
     */
    hideProgressUI() {
        const progressContainer = document.getElementById('preload-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    },

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Image cache cleared');
    },

    /**
     * Get cache size
     */
    getCacheSize() {
        return this.cache.size;
    }
};
