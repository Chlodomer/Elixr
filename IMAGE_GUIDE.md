# Image Creation Guide for Elixr Simulator

## Quick Overview

You need **180 images** total (or can start with fewer for MVP).

**Minimum for MVP**: 45 images (1 ethnicity × 3 hair types × 3 views × 5 gray levels)

## Fastest Approach: AI Generation

### Using Midjourney

1. Go to Midjourney (requires Discord)
2. Use these prompt templates:

```
/imagine prompt: professional headshot photograph, caucasian man,
straight short dark brown hair, 0% gray hair, front view, age 30,
neutral gray background, studio lighting, realistic, high detail --ar 1:1 --v 6

/imagine prompt: professional headshot photograph, caucasian man,
straight short hair with 25% gray at temples, front view, age 40,
neutral gray background, studio lighting, realistic, high detail --ar 1:1 --v 6

/imagine prompt: professional headshot photograph, caucasian man,
straight short hair with 50% gray hair, front view, age 50,
neutral gray background, studio lighting, realistic, high detail --ar 1:1 --v 6
```

3. For top view:
```
/imagine prompt: top view photograph of head, caucasian man,
straight short hair, 25% gray at crown, neutral gray background,
overhead angle, studio lighting, realistic, high detail --ar 1:1 --v 6
```

4. For back view:
```
/imagine prompt: back view photograph of head, caucasian man,
straight short hair, 50% gray hair visible from behind,
neutral gray background, studio lighting, realistic, high detail --ar 1:1 --v 6
```

### Using DALL-E 3 (ChatGPT Plus)

1. Go to ChatGPT
2. Use similar prompts:

```
Create a professional headshot photograph of a Caucasian man in his 30s
with straight short dark brown hair showing no gray hair. Front view,
neutral gray background, studio lighting, realistic style.
```

### Using Stable Diffusion (Free)

1. Use Stability.ai or local installation
2. Similar prompts to above
3. More technical setup but free

## Alternative: Simplified Avatar Style

Instead of realistic photos, use illustrated avatars:

### Benefits:
- Easier to maintain consistency
- Faster to create variations
- Can use vector graphics
- Smaller file sizes

### Tools:
- **Character Creator 4** (paid)
- **Bitmoji** style avatars
- **Vector illustration** in Illustrator/Figma

### Example prompt for illustrated style:
```
Vector illustration, simple avatar style, caucasian person,
straight short hair, 25% gray hair, front view, flat design,
minimal style, professional
```

## Budget Options

### Option 1: Hire on Fiverr
- Search: "AI image generation" or "character illustration"
- Cost: $20-50 for bulk generation
- Turnaround: 1-3 days
- Provide this document as requirements

### Option 2: Use Stock Photos
1. Purchase stock photo packages (depositphotos.com, shutterstock.com)
2. Search for: "man different ages gray hair"
3. Edit in Photoshop:
   - Adjust hair color using Hue/Saturation
   - Create 5 versions per photo
   - Crop consistently

### Option 3: Photoshoot (Most Realistic)
- Hire models from each ethnicity
- Photograph from 3 angles
- Use makeup/hair color spray for gray variations
- Most expensive but highest quality

## Minimum Viable Image Set

To get started quickly, create just **ONE complete set**:

**Caucasian + Straight Short Hair = 15 images**
- front-0.jpg, front-25.jpg, front-50.jpg, front-75.jpg, front-100.jpg
- top-0.jpg, top-25.jpg, top-50.jpg, top-75.jpg, top-100.jpg
- back-0.jpg, back-25.jpg, back-50.jpg, back-75.jpg, back-100.jpg

This lets you demo the full functionality with one ethnicity/hair type combo.

## Image Editing Tips

### Converting Color to Gray in Photoshop

1. Open image
2. Select hair using Quick Select tool
3. Create new layer
4. Desaturate: Image > Adjustments > Hue/Saturation
5. Reduce Saturation to create gray
6. Adjust Lightness to make it more white/gray
7. Save 5 versions:
   - 0% gray: Original color
   - 25% gray: Desaturate 25%, lighten 15%
   - 50% gray: Desaturate 60%, lighten 30%
   - 75% gray: Desaturate 85%, lighten 45%
   - 100% gray: Desaturate 100%, lighten 60%

### Batch Processing

1. Record Photoshop Action for gray conversion
2. Apply to multiple photos at once
3. File > Automate > Batch

## Naming Convention

**IMPORTANT**: Files must be named exactly as shown:

```
[view]-[graylevel].jpg

Examples:
- front-0.jpg
- front-25.jpg
- top-50.jpg
- back-100.jpg
```

## Quality Checklist

Before finalizing images, ensure:

- ✅ Consistent background color across all images
- ✅ Same head size/position in frame
- ✅ Similar lighting conditions
- ✅ Clear visibility of hair
- ✅ Realistic gray progression
- ✅ Correct file naming
- ✅ 800×800px dimensions
- ✅ Compressed for web (under 200KB per image)

## Priority Order

If short on time, create images in this order:

1. **Priority 1**: Caucasian, Straight Short, All views (15 images)
   - This is your demo set

2. **Priority 2**: Add other hair types for Caucasian (45 images total)
   - Shows variation in hair types

3. **Priority 3**: Add African American ethnicity (90 images total)
   - Shows ethnicity differences

4. **Priority 4**: Complete all combinations (180 images)
   - Full functionality

## Testing

After creating images:

1. Place in correct folder structure
2. Open `index.html` in browser
3. Select matching ethnicity/hair type
4. Verify images load correctly
5. Check that gray progression looks natural
6. Test all three views

## Compression

Before deploying, compress images:

- Use TinyPNG.com or similar
- Target: Under 200KB per image
- Maintain visual quality
- Total site size should be under 30MB

## Placeholder Mode

The app works without images! It will show SVG placeholders with:
- Gray percentage
- Ethnicity
- Hair type
- View name

This is perfect for:
- Initial development
- Demonstrations without images
- Testing functionality

You can deploy and demo the app immediately, then add real images later.
