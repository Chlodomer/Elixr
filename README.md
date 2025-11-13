# Elixr Hair Whitening Simulator

An interactive web application that visualizes hair whitening progression over time and demonstrates the impact of Elixr's treatment.

## 🔗 Live Demo

**[View Live Demo](https://chlodomer.github.io/Elixr/)**

## ✨ Quick Start

### Online
Simply visit the [live demo](https://chlodomer.github.io/Elixr/)

### Local Development
1. Clone this repository: `git clone https://github.com/Chlodomer/Elixr.git`
2. Open `index.html` in a web browser
3. Select your ethnicity and hair type
4. Adjust age and lifestyle parameters
5. Toggle Elixr usage to see the difference

## 🎯 Features

### Core Functionality
- **3 Ethnicity Options**: Caucasian, African American, Middle Eastern/Asian
- **4 Hair Types**: Straight Short, Straight Long, Curly Short, Curly Long
- **Multiple Views**: Front, Top, and Back views of the head
- **Interactive Parameters**:
  - Age slider (20-80 years) with real-time updates
  - Stress level (0-100% continuous slider)
  - Sun exposure (0-100% continuous slider)
  - Work environment (Indoor/Office, Outdoor, Chemical Exposure)
  - Smoking status
  - Hair dyeing status
- **Elixr Comparison**: Side-by-side comparison with and without Elixr treatment
- **Real-time Updates**: Calculations update instantly as you adjust parameters

### Design Features
- **Luxury Aesthetic**: Sophisticated grayscale design with subtle blue accents
- **Smooth Transitions**: Fade-in/fade-out animations between screens (500ms)
- **Rounded Corners**: Consistent 6-12px border radius throughout
- **Elegant Icons**:
  - Circular monogram letters for ethnicity selection (C, A, M)
  - Minimalist line art for hair types with hover animations
- **Interactive Elements**:
  - Custom work environment button group
  - Rounded square slider toggles (3px border-radius)
  - Blue glow hover effects on all interactive elements
- **Onboarding Flow**: Educational screen explaining the simulator's features
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 💻 Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript
- **No Dependencies**: Zero frameworks, zero build process
- **Static Site**: GitHub Pages compatible
- **Responsive Design**: Mobile and desktop optimized
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📚 Documentation

- **[PRD.md](PRD.md)** - Complete Product Requirements Document
- **[CHANGES.md](CHANGES.md)** - Initial design and functionality changes
- **[DESIGN_UPDATES.md](DESIGN_UPDATES.md)** - Luxury aesthetic refinements
- **[ICON_UPDATES.md](ICON_UPDATES.md)** - Custom icon design details
- **[IMAGE_GUIDE.md](IMAGE_GUIDE.md)** - Comprehensive image creation guide
- **[QUICK_START.md](QUICK_START.md)** - Quick deployment guide

## Image Requirements

The app requires images for each combination of:
- 3 ethnicities × 4 hair types × 3 views × 5 gray levels = **180 total images**

### Directory Structure

```
images/
├── caucasian/
│   ├── straight-short/
│   │   ├── front-0.jpg    (0-10% gray)
│   │   ├── front-25.jpg   (10-35% gray)
│   │   ├── front-50.jpg   (35-65% gray)
│   │   ├── front-75.jpg   (65-85% gray)
│   │   ├── front-100.jpg  (85-100% gray)
│   │   ├── top-0.jpg
│   │   ├── top-25.jpg
│   │   ├── top-50.jpg
│   │   ├── top-75.jpg
│   │   ├── top-100.jpg
│   │   ├── back-0.jpg
│   │   ├── back-25.jpg
│   │   ├── back-50.jpg
│   │   ├── back-75.jpg
│   │   └── back-100.jpg
│   ├── straight-long/
│   │   └── (same 15 images)
│   ├── curly-short/
│   │   └── (same 15 images)
│   └── curly-long/
│       └── (same 15 images)
├── african-american/
│   └── (same structure as caucasian)
└── middle-eastern/
    └── (same structure as caucasian)
```

### Image Specifications

- **Format**: JPG (recommended) or PNG
- **Size**: 800×800 pixels (square)
- **Background**: Neutral gray or white
- **Lighting**: Consistent across all images
- **Head Position**: Centered, consistent angle

### Creating Images

**Option 1: AI Generation (Fastest)**
Use Midjourney, DALL-E, or Stable Diffusion with prompts like:
```
"Professional headshot, [ethnicity] person, [hair type] hair, [X]% gray hair,
front view, neutral background, consistent lighting, age [Y], realistic photograph"
```

**Option 2: Stock Photos + Photoshop**
- Find stock photos of people with different hair colors
- Adjust hair color in Photoshop using Hue/Saturation
- Create 5 versions for each gray level

**Option 3: Illustration/Avatar Style**
- Simpler to create consistent variations
- Can use tools like Character Creator or vector graphics
- Easier to maintain style consistency

### Placeholder Behavior

Currently, if images are missing, the app will show SVG placeholders with:
- Ethnicity name
- Hair type
- Gray percentage
- View name

This allows the app to function without images for development/testing.

## 🚀 Deployment to GitHub Pages

This repository is already deployed to GitHub Pages at: **https://chlodomer.github.io/Elixr/**

### To Update the Live Site

1. Make your changes locally
2. Commit and push to the main branch:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin main
   ```
3. GitHub Pages will automatically update within 1-2 minutes

### GitHub Pages Configuration

- **Source**: `main` branch, `/ (root)` folder
- **Build**: Automatic (no build process required - static site)
- **Custom Domain**: Can be configured in repository Settings > Pages

### To Deploy Your Own Fork

1. Fork this repository
2. Go to your fork's Settings > Pages
3. Select "main" branch and "/ (root)" folder
4. Save - your site will be live at `https://YOUR_USERNAME.github.io/Elixr/`

## Customization

### Updating Elixr Efficacy Data

Edit `js/config.js` and modify the `elixr` object:

```javascript
elixr: {
    slowingFactor: 0.7,    // Change to actual slowing percentage
    reversalPercent: 18,   // Change to actual reversal percentage
    description: 'Your description here'
}
```

### Adjusting Ethnicity Base Rates

Edit `js/config.js` in the `ethnicities` object:

```javascript
'caucasian': {
    name: 'Caucasian',
    baseRate: 1.0,        // Adjust multiplier
    startAge: 35,         // Adjust typical start age
    description: 'Your description'
}
```

### Modifying Lifestyle Factor Weights

Edit `js/config.js` in the `factors` object:

```javascript
stress: {
    0: { weight: 0, label: 'Low' },
    1: { weight: 0.3, label: 'Medium' },  // Adjust weight
    2: { weight: 0.6, label: 'High' }     // Adjust weight
}
```

## File Structure

```
/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── config.js          # Configuration and data
│   ├── calculator.js      # Whitening calculation logic
│   └── app.js             # Main application logic
├── images/                # Avatar images (180 files)
│   ├── caucasian/
│   ├── african-american/
│   └── middle-eastern/
├── PRD.md                 # Product Requirements Document
└── README.md              # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

The app runs entirely client-side with no build process required. Simply:

1. Edit files
2. Refresh browser to see changes
3. No compilation or bundling needed

## Scientific Data Integration

To integrate real research data:

1. Update ethnicity base rates in `js/config.js`
2. Adjust lifestyle factor weights based on studies
3. Update Elixr efficacy percentages
4. Add citations in the UI if desired

## Future Enhancements

- Photo upload for personalized avatars
- 3D head rotation
- Backend for data collection
- Multi-language support
- Email results functionality
- Social media sharing integration
- Mobile app version

## License

Proprietary - Elixr Bio

## Contact

For questions or support, contact the development team.
