// Quick calculation test
const CONFIG = {
    ethnicities: {
        'caucasian': {
            name: 'Caucasian',
            baseRate: 1.0,
            startAge: 35
        }
    },
    factors: {
        stress: { minMultiplier: 1.0, maxMultiplier: 1.35, ageShift: 2.5 },
        sun: { minMultiplier: 1.0, maxMultiplier: 1.25, ageShift: 2.5 },
        work: {
            0: { multiplier: 1.0, ageShift: 0 },
            1: { multiplier: 1.15, ageShift: 1.5 },
            2: { multiplier: 1.30, ageShift: 2.5 }
        },
        smoking: { multiplier: 2.2, ageShift: 3.5 }
    }
};

function testCalc(age, stress, sun, work, smoking) {
    const ethnicity = CONFIG.ethnicities.caucasian;

    // Age shifts
    let totalAgeShift = 0;
    totalAgeShift += (stress / 100) * CONFIG.factors.stress.ageShift;
    totalAgeShift += (sun / 100) * CONFIG.factors.sun.ageShift;
    totalAgeShift += CONFIG.factors.work[work].ageShift;
    if (smoking) totalAgeShift += CONFIG.factors.smoking.ageShift;

    const effectiveAge = age + totalAgeShift;
    const yearsSinceStart = Math.max(0, effectiveAge - ethnicity.startAge);
    const baseGray = yearsSinceStart * 1.3;

    // Multipliers
    let mult = 1.0;
    mult *= CONFIG.factors.stress.minMultiplier + (stress / 100) * 0.35;
    mult *= CONFIG.factors.sun.minMultiplier + (sun / 100) * 0.25;
    mult *= CONFIG.factors.work[work].multiplier;
    if (smoking) mult *= CONFIG.factors.smoking.multiplier;

    const totalGray = baseGray * mult * ethnicity.baseRate;

    console.log('Age ' + age + ', Stress ' + stress + '%, Sun ' + sun + '%, Work ' + work + ', Smoking ' + smoking);
    console.log('  Effective age: ' + effectiveAge.toFixed(1));
    console.log('  Years since onset: ' + yearsSinceStart.toFixed(1));
    console.log('  Base gray: ' + baseGray.toFixed(1) + '%');
    console.log('  Multiplier: ' + mult.toFixed(2) + 'x');
    console.log('  Total gray: ' + totalGray.toFixed(1) + '%');
    console.log('');
}

console.log("Testing calculations:");
console.log('');
testCalc(30, 0, 0, 0, false);  // Should be 0% (too young)
testCalc(40, 0, 0, 0, false);  // Should be ~6.5%
testCalc(50, 0, 0, 0, false);  // Should be ~19.5%
testCalc(50, 100, 100, 2, true);  // Should be very high
