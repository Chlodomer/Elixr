# Quick Start Guide - Elixr Simulator

## Test the App Right Now (2 minutes)

1. **Open the app**:
   ```bash
   # Navigate to the App folder
   cd "/Users/yanivfox/Desktop/Consultancy and Lectures/Elixrbio/App"

   # Open in your default browser
   open index.html
   ```

   Or simply double-click `index.html`

2. **Walk through the flow**:
   - Click "Start Simulation"
   - Select any ethnicity (e.g., Caucasian)
   - Select any hair type (e.g., Straight Short)
   - You'll see the simulator with placeholder images
   - Move the age slider - watch percentages change
   - Adjust stress, sun exposure - see the impact
   - Toggle Elixr ON/OFF - see dramatic difference

## What You'll See

The app works **immediately** with SVG placeholders showing:
- Gray percentage
- Selected ethnicity and hair type
- Current view (Front/Top/Back)

This lets you demo the **full functionality** without images.

## Deploy to GitHub Pages (10 minutes)

### Step 1: Create GitHub Repository

1. Go to github.com
2. Click "New Repository"
3. Name it: `elixr-simulator`
4. Make it Public
5. Don't initialize with README
6. Click "Create Repository"

### Step 2: Push Your Code

```bash
cd "/Users/yanivfox/Desktop/Consultancy and Lectures/Elixrbio/App"

git init
git add .
git commit -m "Initial release: Elixr Hair Whitening Simulator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/elixr-simulator.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Click "Pages" in sidebar
3. Under "Source", select "main" branch
4. Select "/ (root)" folder
5. Click "Save"
6. Wait 1-2 minutes

### Step 4: Access Your Live Site

Your app will be live at:
```
https://YOUR_USERNAME.github.io/elixr-simulator/
```

Share this URL with anyone!

## Add Images Later (Optional)

When you're ready to add real images:

1. Follow instructions in `IMAGE_GUIDE.md`
2. Place images in the correct folders
3. Commit and push:
   ```bash
   git add images/
   git commit -m "Add avatar images"
   git push
   ```
4. Images will appear automatically

## Customize for Your Board Meeting

### Update Elixr Efficacy Numbers

Edit `js/config.js` (around line 50):

```javascript
elixr: {
    slowingFactor: 0.7,    // 70% reduction - CHANGE THIS
    reversalPercent: 18,   // 18% reversal - CHANGE THIS
    description: 'Your description here'
}
```

### Update Ethnicity Start Ages

Edit `js/config.js` (lines 5-25):

```javascript
'caucasian': {
    name: 'Caucasian',
    baseRate: 1.0,
    startAge: 35,  // CHANGE THIS
    description: 'Typically begins whitening in mid-30s'
}
```

After editing, just refresh the browser to see changes!

## Demo Script for Board Presentation

Here's how to present it:

1. **Open the live site**

2. **Introduction** (30 seconds):
   - "We've built an interactive simulator to help people understand hair whitening and Elixr's impact"

3. **Walk through onboarding** (30 seconds):
   - Select ethnicity
   - Select hair type
   - "This personalizes the experience"

4. **Show the simulator** (2 minutes):
   - "Here's a 30-year-old Caucasian person"
   - Move age slider to 50: "Without Elixr, they'd have 35% gray hair"
   - Toggle Elixr OFF: "But WITH Elixr, only 8% gray"
   - "That's a 77% reduction in hair whitening"

5. **Show lifestyle factors** (1 minute):
   - Increase stress: "High stress accelerates whitening"
   - Add sun exposure: "These factors compound"
   - Toggle Elixr back ON: "Elixr counteracts all these factors"

6. **Views** (30 seconds):
   - Click Top view: "Users can see from different angles"
   - Click Back view: "Full 360° visualization"

7. **Call to action** (30 seconds):
   - "This will be a key tool for customer education"
   - "Can be embedded on our website"
   - "Shareable for social media marketing"

**Total time**: 5 minutes

## Troubleshooting

### App doesn't load?
- Make sure you opened `index.html` (not a different file)
- Check browser console for errors (F12 or Cmd+Option+I)

### Styles look broken?
- Verify `css/styles.css` exists
- Check browser console for 404 errors

### JavaScript not working?
- Verify `js/config.js`, `js/calculator.js`, and `js/app.js` exist
- Check browser console for errors

### GitHub Pages not working?
- Wait 5 minutes (can take time to build)
- Check repository Settings > Pages for status
- Make sure repository is Public

## Next Steps

1. **Test locally** - Walk through the entire flow
2. **Customize data** - Update with real research numbers
3. **Deploy to GitHub** - Get it live
4. **Share with team** - Get feedback
5. **Add images** - When you have time (optional)
6. **Present to board** - Thursday meeting

## Files Overview

```
index.html          → Main page (onboarding + simulator)
css/styles.css      → All styling and layout
js/config.js        → Data and configuration ← EDIT THIS
js/calculator.js    → Whitening calculations
js/app.js           → Interactive logic

README.md           → Full documentation
PRD.md              → Product requirements
IMAGE_GUIDE.md      → How to create images
QUICK_START.md      → This file
```

## Questions?

- How to change Elixr percentages? → Edit `js/config.js`
- How to add images? → See `IMAGE_GUIDE.md`
- How to deploy? → Follow steps above
- How to customize? → See `README.md`

## You're Done! 🎉

The app is fully functional and ready to demo.

Open `index.html` now to try it!
