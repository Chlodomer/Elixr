// Hair Whitening Calculator

const Calculator = {
    /**
     * Calculate gray hair percentage based on parameters
     * @param {Object} params - Calculation parameters
     * @param {string} params.ethnicity - Selected ethnicity
     * @param {number} params.age - Current age
     * @param {number} params.stress - Stress level (0-2)
     * @param {number} params.sun - Sun exposure (0-2)
     * @param {number} params.work - Work environment (0-2)
     * @param {boolean} params.smoking - Is smoking
     * @param {boolean} params.dyeing - Is dyeing hair
     * @param {boolean} params.usingElixr - Is using Elixr
     * @returns {Object} - { withoutElixr: number, withElixr: number }
     */
    calculateGrayPercentage(params) {
        const ethnicity = CONFIG.ethnicities[params.ethnicity];

        // Base calculation without Elixr
        const baseGray = this._calculateBase(ethnicity, params);

        // Calculation with Elixr
        const withElixr = this._applyElixrEffect(baseGray, params.age, ethnicity.startAge);

        return {
            withoutElixr: Math.min(100, Math.max(0, Math.round(baseGray))),
            withElixr: Math.min(100, Math.max(0, Math.round(withElixr)))
        };
    },

    /**
     * Calculate base gray percentage without Elixr
     */
    _calculateBase(ethnicity, params) {
        // Age-based progression
        const yearsSinceStart = Math.max(0, params.age - ethnicity.startAge);
        const ageModifier = yearsSinceStart * 1.2; // ~1.2% gray per year after start age

        // Lifestyle factors (continuous 0-100 scale converted to impact)
        // params.stress and params.sun are now 0-100 values
        const stressModifier = (params.stress / 100) * CONFIG.factors.stress.maxWeight * 10;
        const sunModifier = (params.sun / 100) * CONFIG.factors.sun.maxWeight * 10;
        const workModifier = CONFIG.factors.work[params.work].weight * 10;
        const smokingModifier = params.smoking ? CONFIG.factors.smoking.weight * 10 : 0;

        // Combine all factors
        const lifestyleTotal = stressModifier + sunModifier + workModifier + smokingModifier;

        // Apply ethnicity base rate
        const totalGray = (ageModifier + lifestyleTotal) * ethnicity.baseRate;

        return totalGray;
    },

    /**
     * Apply Elixr treatment effects
     */
    _applyElixrEffect(baseGray, currentAge, startAge) {
        // Elixr slows new whitening
        const slowedGray = baseGray * (1 - CONFIG.elixr.slowingFactor);

        // Elixr can reverse some existing gray
        const reversalAmount = Math.min(baseGray * 0.18, CONFIG.elixr.reversalPercent);

        // Combined effect
        const withElixr = slowedGray - reversalAmount;

        return Math.max(0, withElixr);
    },

    /**
     * Get the appropriate image path based on gray percentage
     * @param {string} ethnicity - Selected ethnicity
     * @param {string} hairType - Selected hair type
     * @param {string} view - Current view (front/top/back)
     * @param {number} grayPercent - Gray hair percentage
     * @returns {string} - Image path
     */
    getImagePath(ethnicity, hairType, view, grayPercent) {
        // Determine which gray level to use
        let grayLevel = '0';
        for (const [level, range] of Object.entries(CONFIG.grayLevels)) {
            if (grayPercent >= range.min && grayPercent <= range.max) {
                grayLevel = range.name;
                break;
            }
        }

        // Construct path
        return `images/${ethnicity}/${hairType}/${view}-${grayLevel}.jpg`;
    },

    /**
     * Get descriptive text for gray percentage
     * @param {number} grayPercent - Gray hair percentage
     * @returns {string} - Description
     */
    getDescription(grayPercent) {
        if (grayPercent < 10) {
            return 'Minimal to no visible gray hair';
        } else if (grayPercent < 25) {
            return 'Few scattered gray hairs';
        } else if (grayPercent < 50) {
            return 'Noticeable gray at temples and crown';
        } else if (grayPercent < 75) {
            return 'Majority of hair showing gray';
        } else {
            return 'Predominantly gray or white hair';
        }
    },

    /**
     * Calculate projected gray at different ages
     * @param {Object} params - Base parameters
     * @param {Array<number>} ages - Array of ages to calculate
     * @returns {Array<Object>} - Array of { age, grayPercent } objects
     */
    projectFuture(params, ages) {
        return ages.map(age => {
            const result = this.calculateGrayPercentage({ ...params, age });
            return {
                age,
                withoutElixr: result.withoutElixr,
                withElixr: result.withElixr
            };
        });
    }
};
