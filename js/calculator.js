// Hair Whitening Calculator - CSV Data Lookup Version

const Calculator = {
    /**
     * Map app ethnicity to CSV ethnicity
     */
    _mapEthnicity(appEthnicity) {
        const mapping = {
            'caucasian': 'Caucasian',
            'african-american': 'African_American',
            'middle-eastern': 'East_Asian' // Using East_Asian for Middle Eastern
        };
        return mapping[appEthnicity] || 'Caucasian';
    },

    /**
     * Map numeric level (0-2) to CSV level string
     */
    _mapLevel(numericLevel) {
        const levels = ['low', 'moderate', 'high'];
        const level = Math.min(2, Math.max(0, Math.floor(numericLevel)));
        return levels[level];
    },

    /**
     * Map boolean to CSV string
     */
    _mapBoolean(value, trueStr, falseStr) {
        return value ? trueStr : falseStr;
    },

    /**
     * Calculate gray hair percentage based on parameters
     * @param {Object} params - Calculation parameters
     * @param {string} params.ethnicity - Selected ethnicity (caucasian, african-american, middle-eastern)
     * @param {number} params.age - Current age
     * @param {number} params.projectionYears - Years into the future (0, 5, 10, 20)
     * @param {number} params.stress - Stress level (0-2: minimal, moderate, extreme)
     * @param {number} params.sun - Sun exposure (0-2: minimal, moderate, extreme)
     * @param {number} params.work - Work environment (0-2)
     * @param {boolean} params.smoking - Is smoking
     * @param {boolean} params.dyeing - Is dyeing hair
     * @param {boolean} params.usingElixr - Is using Elixr
     * @param {string} [params.gender] - UI gender selection (male, female, etc.)
     * @returns {Object} - { withoutElixr: number, withElixr: number | string }
     */
    calculateGrayPercentage(params) {
        // Calculate projected age
        const projectionYears = params.projectionYears || 0;
        const projectedAge = Math.round(params.age + projectionYears);

        // Map app parameters to CSV format
        const csvEthnicity = this._mapEthnicity(params.ethnicity);

        // For stress and sun, we'll use the higher of the two as UV level
        // and stress level separately
        const stressLevel = this._mapLevel(params.stress);

        // For UV, combine sun exposure and work environment
        // Work: 0=indoor, 1=outdoor, 2=chemical
        let uvNumeric = params.sun;
        if (params.work === 1) uvNumeric = Math.max(uvNumeric, 1); // Outdoor work
        if (params.work === 2) uvNumeric = Math.max(uvNumeric, 1.5); // Chemical exposure
        const uvLevel = this._mapLevel(uvNumeric);

        const smoking = this._mapBoolean(params.smoking, 'smoking', 'no_smoking');

        // Map UI gender to CSV sex (default to male for non-binary / unspecified)
        const sex = params.gender === 'female' ? 'female' : 'male';

        // Lookup gray percentage without Elixr
        const withoutElixr = this._lookupGrayPercent(
            csvEthnicity,
            projectedAge,
            smoking,
            uvLevel,
            stressLevel,
            'no',
            sex
        );

        // Lookup gray percentage with Elixr
        // Treatment needs time to work - only show results after 6 months
        let withElixr;
        if (projectionYears < 0.5) {
            withElixr = 'N/A';
        } else {
            withElixr = this._lookupGrayPercent(
                csvEthnicity,
                projectedAge,
                smoking,
                uvLevel,
                stressLevel,
                'yes',
                sex
            );
        }

        return {
            withoutElixr: withoutElixr,
            withElixr: withElixr
        };
    },

    /**
     * Look up gray percentage from CSV data
     */
    _lookupGrayPercent(ethnicity, age, smoking, uvLevel, stressLevel, elixrUse, sex = 'male') {
        // Clamp age to available range (20-80)
        age = Math.min(80, Math.max(20, age));

        try {
            // Select appropriate dataset (fallback to male/default if female data not available)
            let dataSource;
            if (sex === 'female' && typeof HAIR_WHITENING_DATA_FEMALE !== 'undefined') {
                dataSource = HAIR_WHITENING_DATA_FEMALE;
            } else if (typeof HAIR_WHITENING_DATA_MALE !== 'undefined') {
                dataSource = HAIR_WHITENING_DATA_MALE;
            } else {
                dataSource = HAIR_WHITENING_DATA;
            }

            // Navigate the nested data structure
            const ethnicityData = dataSource[ethnicity];
            if (!ethnicityData) {
                console.warn(`Ethnicity not found: ${ethnicity}`);
                return 0;
            }

            const ageData = ethnicityData[age];
            if (!ageData) {
                console.warn(`Age not found: ${age} for ${ethnicity}`);
                return 0;
            }

            const smokingData = ageData[smoking];
            if (!smokingData) {
                console.warn(`Smoking data not found: ${smoking}`);
                return 0;
            }

            const uvData = smokingData[uvLevel];
            if (!uvData) {
                console.warn(`UV level not found: ${uvLevel}`);
                return 0;
            }

            const stressData = uvData[stressLevel];
            if (!stressData) {
                console.warn(`Stress level not found: ${stressLevel}`);
                return 0;
            }

            const grayPercent = stressData[elixrUse];
            if (grayPercent === undefined) {
                console.warn(`Elixr data not found: ${elixrUse}`);
                return 0;
            }

            return grayPercent;
        } catch (error) {
            console.error('Lookup error:', error, {
                ethnicity, age, smoking, uvLevel, stressLevel, elixrUse, sex
            });
            return 0;
        }
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
