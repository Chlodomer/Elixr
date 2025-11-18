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
     * Uses research-based multiplicative model:
     * - Age shifts from lifestyle factors (advancing effective age)
     * - Multipliers applied to graying rate
     * - Based on peer-reviewed hair whitening studies (see app_data.md)
     */
    _calculateBase(ethnicity, params) {
        // Step 1: Calculate total age shift from all factors
        // Each factor can "advance" the biological age of hair
        let totalAgeShift = 0;

        // v2.0: Stress age shift (discrete: 0=minimal, 1=moderate, 2=extreme)
        const stressLevel = Math.min(2, Math.max(0, Math.floor(params.stress)));
        const stressShift = CONFIG.factors.stress.ageShifts[stressLevel];
        totalAgeShift += stressShift;

        // v2.0: Sun/UV age shift (discrete: 0=minimal, 1=moderate, 2=extreme)
        const sunLevel = Math.min(2, Math.max(0, Math.floor(params.sun)));
        const sunShift = CONFIG.factors.sun.ageShifts[sunLevel];
        totalAgeShift += sunShift;

        // Work environment age shift
        totalAgeShift += CONFIG.factors.work[params.work].ageShift;

        // Smoking age shift
        if (params.smoking) {
            totalAgeShift += CONFIG.factors.smoking.ageShift;
        }

        // Step 2: Calculate effective age (biological age for hair)
        const effectiveAge = params.age + totalAgeShift;
        const yearsSinceStart = Math.max(0, effectiveAge - ethnicity.startAge);

        // Step 3: Base graying rate (intrinsic aging)
        // Research shows ~1.2-1.5% gray per year after onset for Caucasians
        // This is the baseline before multipliers
        const baseGrayingRate = 1.3; // % per year
        let baseGray = yearsSinceStart * baseGrayingRate;

        // Step 4: Apply lifestyle multipliers
        // v2.0: These multiply the base graying rate (research-based from app_data.md)
        let totalMultiplier = 1.0;

        // v2.0: Stress multiplier (discrete levels: 0=minimal, 1=moderate, 2=extreme)
        const stressMultiplier = CONFIG.factors.stress.multipliers[stressLevel];
        totalMultiplier *= stressMultiplier;

        // v2.0: Sun/UV multiplier (discrete levels: 0=minimal, 1=moderate, 2=extreme)
        const sunMultiplier = CONFIG.factors.sun.multipliers[sunLevel];
        totalMultiplier *= sunMultiplier;

        // Work environment multiplier
        totalMultiplier *= CONFIG.factors.work[params.work].multiplier;

        // Smoking multiplier (2.2x if smoking)
        if (params.smoking) {
            totalMultiplier *= CONFIG.factors.smoking.multiplier;
        }

        // Step 5: Apply multiplier to base gray
        const adjustedGray = baseGray * totalMultiplier;

        // Step 6: Apply ethnicity base rate
        // Different ethnicities have different overall graying rates
        const totalGray = adjustedGray * ethnicity.baseRate;

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
