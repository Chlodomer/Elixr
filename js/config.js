// Configuration for the Elixr Hair Whitening Simulator

const CONFIG = {
    // Ethnicity-specific data
    ethnicities: {
        'caucasian': {
            name: 'Caucasian',
            baseRate: 1.0,
            startAge: 35, // Typical age when whitening begins
            description: 'Typically begins whitening in mid-30s'
        },
        'african-american': {
            name: 'African American',
            baseRate: 0.7,
            startAge: 44,
            description: 'Typically begins whitening in mid-40s'
        },
        'middle-eastern': {
            name: 'Middle Eastern / Asian',
            baseRate: 0.85,
            startAge: 38,
            description: 'Typically begins whitening in late-30s'
        }
    },

    // Hair type options
    hairTypes: {
        'straight-short': 'Straight Short',
        'straight-long': 'Straight Long',
        'curly-short': 'Curly Short',
        'curly-long': 'Curly Long'
    },

    // View options for avatar
    views: ['front', 'top', 'back'],

    // Gray level thresholds for image selection
    grayLevels: {
        0: { min: 0, max: 10, name: '0' },      // 0-10% gray
        25: { min: 10, max: 35, name: '25' },   // 10-35% gray
        50: { min: 35, max: 65, name: '50' },   // 35-65% gray
        75: { min: 65, max: 85, name: '75' },   // 65-85% gray
        100: { min: 85, max: 100, name: '100' } // 85-100% gray
    },

    // v2.0: Lifestyle factor weights based on peer-reviewed research from app_data.md
    // Smoking: 2.5x risk, advances graying by several years
    // Stress: Can shave off 3-5 years (hormones trigger melanocyte depletion)
    // UV: Moderate effect, shifts by a few years (oxidative stress)
    factors: {
        stress: {
            // v2.0: Discrete levels (0=minimal, 1=moderate, 2=extreme)
            multipliers: [1.0, 1.20, 1.45],  // Research: chronic stress significantly accelerates
            ageShifts: [0, 2, 4],             // Can advance by 0, 2, or 4 years
            label: 'Stress Level'
        },
        sun: {
            // v2.0: Discrete levels (0=minimal, 1=moderate, 2=extreme)
            multipliers: [1.0, 1.15, 1.30],  // Research: UV shifts graying earlier by a few years
            ageShifts: [0, 1.5, 3],           // Can advance by 0, 1.5, or 3 years
            label: 'Sun Exposure'
        },
        work: {
            // Work environment impact based on exposure type
            0: {
                multiplier: 1.0,   // Indoor/Office: no additional impact
                ageShift: 0,
                label: 'Indoor / Office'
            },
            1: {
                multiplier: 1.15,  // Outdoor: moderate UV exposure
                ageShift: 1.5,
                label: 'Outdoor'
            },
            2: {
                multiplier: 1.30,  // Chemical exposure: oxidative stress
                ageShift: 2.5,
                label: 'Chemical Exposure'
            }
        },
        smoking: {
            // Smoking contributes 10-15% overall impact
            // Smokers are 2.5x more likely to gray prematurely
            multiplier: 2.2,       // Heavy smoker = 2.2x graying rate
            ageShift: 3.5,         // Advances graying by ~3.5 years
            label: 'Smoking'
        },
        dyeing: {
            multiplier: 1.0,       // Doesn't affect actual whitening
            ageShift: 0,
            label: 'Hair Dyeing'
        }
    },

    // Elixr treatment effects
    elixr: {
        slowingFactor: 0.7,    // Reduces whitening rate by 70%
        reversalPercent: 18,   // Can reverse up to 18% of gray hair
        description: 'Clinical studies show Elixr can slow hair whitening by up to 70% and reverse existing gray by 15-20%.'
    },

    // Default values
    defaults: {
        age: 30,
        stress: 0,
        sun: 0,
        work: 0,
        smoking: false,
        dyeing: false,
        usingElixr: true
    }
};
