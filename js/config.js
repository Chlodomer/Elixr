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

    // Lifestyle factor weights (for continuous sliders 0-100)
    factors: {
        stress: {
            maxWeight: 0.6,  // Maximum impact at 100%
            label: 'Stress Level'
        },
        sun: {
            maxWeight: 0.4,  // Maximum impact at 100%
            label: 'Sun Exposure'
        },
        work: {
            0: { weight: 0, label: 'Indoor / Office' },
            1: { weight: 0.25, label: 'Outdoor' },
            2: { weight: 0.5, label: 'Chemical Exposure' }
        },
        smoking: {
            weight: 0.4,
            label: 'Smoking'
        },
        dyeing: {
            weight: 0, // Doesn't affect actual whitening, just visibility
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
