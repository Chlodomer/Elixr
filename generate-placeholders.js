#!/usr/bin/env node

/**
 * Placeholder Image Generator for Rotation Testing
 *
 * This script generates placeholder images for the rotation feature.
 * Run with: node generate-placeholders.js
 *
 * Requirements: Node.js (built-in modules only, no dependencies)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    outputDir: 'images/rotation',
    ethnicities: ['caucasian', 'african-american', 'middle-eastern'],
    hairTypes: ['straight-short', 'straight-long', 'curly-short', 'curly-long'],
    genders: ['male', 'female'],
    grayLevels: [0, 25, 50, 75, 100],
    totalAngles: 8,  // 8 angles (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
    imageSize: 600,  // 600x600px
    backgroundColor: '#e2e8f0'
};

/**
 * Create SVG placeholder image
 */
function createSVGPlaceholder(ethnicity, hairType, gender, angle, grayLevel) {
    const ethnicityShort = ethnicity === 'caucasian' ? 'C' : ethnicity === 'african-american' ? 'A' : 'M';
    const hairTypeShort = hairType.includes('straight') ? (hairType.includes('short') ? 'SS' : 'SL') :
                          (hairType.includes('short') ? 'CS' : 'CL');
    const genderShort = gender === 'male' ? 'M' : 'F';

    // Calculate arrow position based on angle
    const centerX = CONFIG.imageSize / 2;
    const centerY = CONFIG.imageSize / 2;
    const radius = 180;
    const angleRad = (angle * Math.PI) / 180;
    const arrowX = centerX + radius * Math.cos(angleRad);
    const arrowY = centerY + radius * Math.sin(angleRad);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CONFIG.imageSize}" height="${CONFIG.imageSize}" viewBox="0 0 ${CONFIG.imageSize} ${CONFIG.imageSize}">
    <!-- Background -->
    <rect width="${CONFIG.imageSize}" height="${CONFIG.imageSize}" fill="${CONFIG.backgroundColor}"/>

    <!-- Rotation circle guide -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#cbd5e0" stroke-width="2" stroke-dasharray="5,5"/>

    <!-- Center circle (head) -->
    <circle cx="${centerX}" cy="${centerY}" r="120" fill="#f0f0f0" stroke="#3a4a5a" stroke-width="3"/>

    <!-- Direction arrow -->
    <line x1="${centerX}" y1="${centerY}" x2="${arrowX}" y2="${arrowY}" stroke="#3a4a5a" stroke-width="4"/>
    <circle cx="${arrowX}" cy="${arrowY}" r="10" fill="#3a4a5a"/>

    <!-- Angle display (top) -->
    <text x="${centerX}" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="#2d3748" font-weight="bold">
        ${angle}°
    </text>

    <!-- Gray level (center) -->
    <text x="${centerX}" y="${centerY - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#4a5568" font-weight="bold">
        ${grayLevel}%
    </text>
    <text x="${centerX}" y="${centerY + 25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#718096">
        Gray
    </text>

    <!-- Details (bottom) -->
    <text x="${centerX}" y="${CONFIG.imageSize - 100}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#4a5568">
        ${ethnicityShort} · ${hairTypeShort} · ${genderShort}
    </text>
    <text x="${centerX}" y="${CONFIG.imageSize - 70}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#718096">
        ${ethnicity}
    </text>
    <text x="${centerX}" y="${CONFIG.imageSize - 50}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#718096">
        ${hairType} - ${gender}
    </text>

    <!-- Placeholder label -->
    <text x="${centerX}" y="${CONFIG.imageSize - 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#a0aec0" font-style="italic">
        Placeholder Image
    </text>
</svg>`;

    return svg;
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Generate all placeholder images
 */
function generatePlaceholders() {
    console.log('🎨 Generating placeholder images for rotation feature...\n');

    let totalImages = 0;
    const angles = [];
    const angleStep = 360 / CONFIG.totalAngles;

    // Calculate angle values
    for (let i = 0; i < CONFIG.totalAngles; i++) {
        angles.push(i * angleStep);
    }

    console.log(`Configuration:`);
    console.log(`- Angles: ${angles.join('°, ')}°`);
    console.log(`- Ethnicities: ${CONFIG.ethnicities.length}`);
    console.log(`- Hair Types: ${CONFIG.hairTypes.length}`);
    console.log(`- Genders: ${CONFIG.genders.length}`);
    console.log(`- Gray Levels: ${CONFIG.grayLevels.length}`);
    console.log(`- Total Images: ${CONFIG.totalAngles * CONFIG.ethnicities.length * CONFIG.hairTypes.length * CONFIG.genders.length * CONFIG.grayLevels.length}\n`);

    // Generate images
    CONFIG.ethnicities.forEach(ethnicity => {
        CONFIG.hairTypes.forEach(hairType => {
            CONFIG.genders.forEach(gender => {
                // Create directory structure
                const dirPath = path.join(CONFIG.outputDir, ethnicity, hairType, gender);
                ensureDir(dirPath);

                CONFIG.grayLevels.forEach(grayLevel => {
                    angles.forEach(angle => {
                        const filename = `${angle}-${grayLevel}.svg`;
                        const filepath = path.join(dirPath, filename);

                        const svg = createSVGPlaceholder(ethnicity, hairType, gender, angle, grayLevel);
                        fs.writeFileSync(filepath, svg);

                        totalImages++;

                        if (totalImages % 50 === 0) {
                            console.log(`Generated ${totalImages} images...`);
                        }
                    });
                });
            });
        });
    });

    console.log(`\n✅ Successfully generated ${totalImages} placeholder images!`);
    console.log(`📁 Location: ${CONFIG.outputDir}/\n`);
    console.log(`Directory structure:`);
    console.log(`${CONFIG.outputDir}/`);
    console.log(`├── caucasian/`);
    console.log(`│   ├── straight-short/`);
    console.log(`│   │   ├── male/`);
    console.log(`│   │   │   ├── 0-0.svg`);
    console.log(`│   │   │   ├── 0-25.svg`);
    console.log(`│   │   │   └── ...`);
    console.log(`│   │   └── female/`);
    console.log(`│   └── ...`);
    console.log(`└── ...\n`);
}

// Run generator
try {
    generatePlaceholders();
} catch (error) {
    console.error('❌ Error generating placeholders:', error);
    process.exit(1);
}
