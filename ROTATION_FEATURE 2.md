# 360° Rotating Head Feature

## Overview

The rotating head feature allows users to interactively rotate a 3D representation of a head to view hair whitening from all angles. Users can drag with their mouse or swipe on touch devices to rotate the view in real-time.

## Features

### Core Functionality
- **360° Rotation**: Full circular rotation using mouse drag or touch swipe
- **8 Angles**: Pre-rendered images at 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
- **Smooth Momentum**: Inertia effect continues rotation after drag release
- **Gender Toggle**: Switch between male and female head views
- **Real-time Updates**: Instantly reflects age and lifestyle parameter changes
- **Angle Display**: Shows current rotation angle in overlay
- **Drag Instructions**: Visual guide with rotation icon

### User Experience
- **Intuitive Interaction**: Natural drag-to-rotate interface
- **Visual Feedback**: Angle display updates in real-time
- **Touch Support**: Works seamlessly on mobile and tablet devices
- **Responsive Design**: Adapts to different screen sizes
- **Luxury Aesthetic**: Matches existing grayscale + blue accent design

## Technical Architecture

### File Structure

```
js/
├── rotation-config.js      # Configuration and settings
├── rotation.js             # Core rotation logic
├── image-preloader.js      # Image preloading system
└── app.js                  # Integration with main app

css/
└── styles.css              # Rotation view styling

images/rotation/
└── {ethnicity}/
    └── {hairType}/
        └── {gender}/
            └── {angle}-{grayLevel}.svg
```

### Image Naming Convention

Format: `{angle}-{grayLevel}.svg`

Examples:
- `0-0.svg` - Front view (0°), 0% gray
- `45-50.svg` - 45° view, 50% gray
- `180-100.svg` - Back view (180°), 100% gray

### Directory Structure

```
images/rotation/
├── caucasian/
│   ├── straight-short/
│   │   ├── male/
│   │   │   ├── 0-0.svg
│   │   │   ├── 0-25.svg
│   │   │   ├── 0-50.svg
│   │   │   ├── 0-75.svg
│   │   │   ├── 0-100.svg
│   │   │   ├── 45-0.svg
│   │   │   └── ... (40 images per combination)
│   │   └── female/
│   │       └── ... (same 40 images)
│   ├── straight-long/
│   ├── curly-short/
│   └── curly-long/
├── african-american/
│   └── ... (same structure)
└── middle-eastern/
    └── ... (same structure)
```

**Total Images**: 960 (8 angles × 5 gray levels × 3 ethnicities × 4 hair types × 2 genders)

## Configuration

### Angle Settings

Edit [js/rotation-config.js](js/rotation-config.js) to change the number of angles:

```javascript
const ROTATION_CONFIG = {
    totalAngles: 8,  // Change to 12, 16, 24, etc.
    // ... rest of config
};
```

**Supported Configurations**:
- **8 angles** (45° steps): 960 images - Current MVP
- **12 angles** (30° steps): 1,440 images - Smoother rotation
- **16 angles** (22.5° steps): 1,920 images - Very smooth
- **24 angles** (15° steps): 2,880 images - Silky smooth

All calculations adapt automatically when you change `totalAngles`.

### Drag Sensitivity

Adjust how much drag distance is needed to rotate:

```javascript
dragSensitivity: 30,  // pixels per angle step
```

- **Higher value** = requires more drag to rotate
- **Lower value** = more sensitive, easier to rotate

### Momentum Settings

Control the inertia effect after drag release:

```javascript
enableMomentum: true,              // Enable/disable momentum
momentumFriction: 0.92,            // 0-1, higher = slower decay
minMomentumVelocity: 0.5,         // Minimum speed to trigger momentum
```

## How It Works

### Rotation Logic

1. **User drags** on the rotation container
2. **Drag distance** is measured in pixels
3. **Angle change** is calculated: `(pixels / dragSensitivity) × angleStep`
4. **Current angle** is updated (0-360°)
5. **Closest frame** is determined from 8 available angles
6. **Image path** is built based on current parameters
7. **Image is switched** to show new angle

### Image Selection

The system automatically selects the correct image based on:

1. **Ethnicity**: Selected in onboarding (caucasian, african-american, middle-eastern)
2. **Hair Type**: Selected in onboarding (straight-short, straight-long, curly-short, curly-long)
3. **Gender**: Toggled in rotation view (male, female)
4. **Angle**: Calculated from rotation (0-7 index)
5. **Gray Level**: Calculated from age and parameters, mapped to 0, 25, 50, 75, 100

### Gray Level Mapping

Gray percentages are rounded to the nearest available level:

| Calculated % | Image Used |
|--------------|------------|
| 0-10%        | 0%         |
| 11-35%       | 25%        |
| 36-65%       | 50%        |
| 66-85%       | 75%        |
| 86-100%      | 100%       |

## Usage

### Accessing Rotation View

1. Complete onboarding (select ethnicity and hair type)
2. On simulator screen, click **"360° Rotate"** tab
3. Drag the head image to rotate
4. Toggle between Male/Female using buttons below

### Drag Controls

**Desktop**:
- Click and drag left/right to rotate
- Release to apply momentum (continues rotating)

**Mobile/Tablet**:
- Touch and swipe left/right to rotate
- Lift finger to apply momentum

### Gender Toggle

Switch between male and female head views:
- Click **Male** or **Female** button
- Images update instantly
- Preloading begins for new gender

## Generating Placeholder Images

For testing without actual head images, use the placeholder generator:

```bash
node generate-placeholders.js
```

This creates **960 SVG placeholder images** showing:
- Current angle (0°-315°)
- Gray percentage (0%-100%)
- Ethnicity identifier (C, A, M)
- Hair type identifier (SS, SL, CS, CL)
- Gender identifier (M, F)

**Output**: `images/rotation/` with full directory structure

## Replacing Placeholders with Real Images

### Option 1: Photographic Renders

1. Create 3D models of heads with different hair types
2. Render at 8 angles (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
3. Apply different gray levels (0%, 25%, 50%, 75%, 100%)
4. Save as JPG: `{angle}-{grayLevel}.jpg`
5. Update [js/rotation-config.js](js/rotation-config.js):
   ```javascript
   return `${this.images.basePath}/${ethnicity}/${hairType}/${gender}/${angle}-${grayLevel}.jpg`;
   ```

### Option 2: AI-Generated Images

Use Midjourney, DALL-E, or Stable Diffusion:

**Prompt Template**:
```
Professional headshot, {ethnicity} {gender}, {hair_type} hair, {gray_percent}% gray hair,
{angle}° view, neutral background, consistent lighting, realistic photograph, medical quality
```

**Example**:
```
Professional headshot, Caucasian male, straight short hair, 50% gray hair,
45° view, neutral background, consistent lighting, realistic photograph, medical quality
```

### Option 3: Illustrated/Schematic Style

Create minimalist line drawings or vector illustrations:

**Benefits**:
- Easier to maintain consistency across angles
- Smaller file sizes
- Can be programmatically generated
- Matches elegant aesthetic

**Tools**: Adobe Illustrator, Figma, or SVG code

## Preloading System

Images are automatically preloaded when:

1. **Rotation view is opened** - Loads all 8 angles for both genders
2. **Gender is switched** - Loads 8 angles for new gender
3. **Parameters change** - If gray level changes significantly

### Progress Indicator

A progress bar appears during preloading:
- Shows percentage loaded
- Automatically hides when complete
- Can be styled in [css/styles.css](css/styles.css)

### Cache Management

Loaded images are cached in memory:

```javascript
ImagePreloader.getCacheSize()  // Get number of cached images
ImagePreloader.clearCache()    // Clear all cached images
```

## Performance Optimization

### Image Format

**Current**: SVG placeholders (~3-5KB each)

**Production Options**:
- **JPG**: Best for photographic renders (30-100KB, good quality)
- **WebP**: Modern format with better compression (20-60KB, excellent quality)
- **SVG**: Best for illustrations (3-10KB, scalable)

### Lazy Loading

Images are only loaded when needed:
- Not loaded until rotation view is opened
- Gender images loaded on demand
- Prevents unnecessary bandwidth usage

### Responsive Sizing

Images are constrained by container:
```css
#rotation-image {
    max-width: 100%;
    max-height: 100%;
}
```

Serve appropriately sized images:
- **Desktop**: 800×800px
- **Tablet**: 600×600px
- **Mobile**: 400×400px

## Expandability

### Adding More Angles

To increase smoothness (e.g., 8 → 12 angles):

1. **Update configuration**:
   ```javascript
   totalAngles: 12,  // Change from 8 to 12
   ```

2. **Generate new images** at 12 angles (0°, 30°, 60°, 90°, 120°, 150°, 180°, 210°, 240°, 270°, 300°, 330°)

3. **Total images increases**: 960 → 1,440

That's it! Everything else adapts automatically.

### Adding More Gray Levels

To add intermediate gray levels (e.g., 10%, 40%, 60%, 90%):

1. **Update configuration**:
   ```javascript
   grayLevels: [0, 10, 25, 40, 50, 60, 75, 90, 100],
   ```

2. **Generate images** for new gray levels

3. **Update mapping** in `_getClosestGrayLevel()` if needed

## Customization

### Styling

Edit [css/styles.css](css/styles.css) to customize:

**Rotation Container**:
```css
.rotation-container {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
```

**Angle Display Overlay**:
```css
.rotation-overlay {
    background: rgba(26, 26, 26, 0.85);
    border: 1px solid rgba(106, 122, 138, 0.3);
}
```

**Gender Toggle**:
```css
.gender-toggle {
    background: linear-gradient(135deg, rgba(42, 58, 74, 0.2) 0%, rgba(26, 26, 26, 0.2) 100%);
}
```

### Rotation Direction

Change rotation direction (clockwise vs counter-clockwise):

```javascript
rotationDirection: 1,   // 1 = clockwise, -1 = counter-clockwise
```

### Starting Angle

Set initial angle when rotation view opens:

```javascript
startAngle: 0,  // 0 = front view, 180 = back view, etc.
```

## Browser Compatibility

- **Chrome** (latest): ✅ Full support
- **Firefox** (latest): ✅ Full support
- **Safari** (latest): ✅ Full support
- **Edge** (latest): ✅ Full support
- **Mobile Safari**: ✅ Touch support
- **Chrome Mobile**: ✅ Touch support

## Accessibility

- **Keyboard Navigation**: Currently not supported (drag-only)
- **Screen Readers**: Image alt text updates with angle
- **Touch Support**: Full touch and swipe support
- **Visual Clarity**: High contrast overlays

## Future Enhancements

Potential improvements:

1. **Keyboard Controls**: Arrow keys to rotate
2. **Auto-Rotate**: Continuous automatic rotation
3. **Zoom**: Pinch-to-zoom on mobile
4. **Tilt View**: Up/down rotation (requires more images)
5. **Reset Button**: Return to front view (0°)
6. **Angle Markers**: Visual indicators at 0°, 90°, 180°, 270°
7. **Comparison Mode**: Side-by-side male/female rotation
8. **Snapshot**: Capture current angle as image
9. **Animation Export**: Create GIF of full rotation

## Troubleshooting

### Images Not Loading

1. Check file paths in browser console
2. Verify images exist in `images/rotation/` directory
3. Check file naming matches convention
4. Ensure web server has access to image directory

### Rotation Feels Laggy

1. Reduce `totalAngles` to 8 for testing
2. Enable image preloading
3. Optimize image file sizes (compress JPGs)
4. Use WebP format for better compression

### Momentum Too Fast/Slow

Adjust friction:
```javascript
momentumFriction: 0.92,  // Increase (0.95) = slower, Decrease (0.85) = faster
```

### Drag Not Sensitive Enough

Reduce sensitivity value:
```javascript
dragSensitivity: 20,  // Lower = more sensitive
```

## Files Modified

This feature added/modified:

**New Files**:
- [js/rotation-config.js](js/rotation-config.js) - Configuration
- [js/rotation.js](js/rotation.js) - Core logic
- [js/image-preloader.js](js/image-preloader.js) - Preloading
- [generate-placeholders.js](generate-placeholders.js) - Placeholder generator
- `images/rotation/` - 960 placeholder images

**Modified Files**:
- [index.html](index.html) - Added rotation view and controls
- [js/app.js](js/app.js) - Integrated rotation view switching
- [css/styles.css](css/styles.css) - Added rotation styling

## Credits

- Rotation system: Sprite-based approach for lightweight performance
- Design: Luxury grayscale aesthetic with subtle blue accents
- Placeholder generator: Node.js with SVG generation

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
