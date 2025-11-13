# Product Requirements Document: Elixr Hair Whitening Simulator

## 1. Overview

### 1.1 Product Summary
A web-based interactive simulator that visualizes the progression of hair whitening over time based on ethnicity, lifestyle factors, and the use of Elixr's topical treatment. The tool helps users understand how various factors affect hair pigmentation and demonstrates the potential impact of Elixr's product.

### 1.2 Goals
- Educate users about hair whitening progression
- Demonstrate the value proposition of Elixr's product
- Provide an engaging, shareable experience for board presentations and customer engagement
- Deploy quickly with minimal complexity

### 1.3 Technical Constraints
- **Hosting**: GitHub Pages (static site only)
- **No Backend**: All logic runs client-side in JavaScript
- **No Database**: All data stored in JSON files or hardcoded
- **Timeline**: Initial version needed by Monday for Thursday board meeting

---

## 2. User Flow

### 2.1 Onboarding Sequence

1. **Welcome Screen**
   - Brief introduction to the simulator
   - "Start Simulation" button

2. **Select Ethnicity/Origin**
   - Three options with visual icons:
     - Caucasian
     - African American
     - Middle Eastern/Asian
   - Each ethnicity has different baseline whitening rates

3. **Select Hair Type**
   - Dropdown or buttons:
     - Straight Short
     - Straight Long
     - Curly Short
     - Curly Long
   - Selection updates the avatar preview

4. **Main Simulator View**
   - Center: Avatar showing selected ethnicity and hair type
   - Side panel: Parameter controls and timeline
   - Results display showing projected outcomes

---

## 3. Core Features

### 3.1 Avatar Display

**Version 0.1 (MVP)**
- Static images showing 3-4 views of a head:
  - Front view
  - Top view (showing crown/scalp)
  - Back view
  - Optional: Side profile
- Images update based on:
  - Selected ethnicity
  - Selected hair type
  - Current age on timeline (showing different levels of gray)

**Future Version**
- User photo upload capability
- 3D rotatable head model

### 3.2 Interactive Parameters

Users can adjust the following lifestyle factors:

| Parameter | Type | Range/Options | Effect on Whitening |
|-----------|------|---------------|---------------------|
| **Current Age** | Slider | 20-80 years | Starting point |
| **Stress Level** | Slider | Low/Medium/High | Accelerates whitening |
| **Sun Exposure** | Slider | Low/Medium/High | Accelerates whitening |
| **Chemical Exposure** | Toggle | Indoor work / Outdoor work / Chemical work | Accelerates whitening |
| **Smoking** | Toggle | Yes/No | Accelerates whitening |
| **Hair Dyeing** | Toggle | Yes/No | Hides natural whitening |
| **Using Elixr** | Toggle | Yes/No | **Slows/reverses whitening** |

### 3.3 Timeline Visualization

**Age Progression Slider**
- Interactive slider: Current Age → Target Age (up to 80)
- As user drags slider, avatar images update to show predicted gray hair at that age
- Display current age number prominently

**Gray Hair Percentage Display**
- Show percentage of gray hair at current slider position
- Compare two scenarios:
  - "Without Elixr: 45% gray"
  - "With Elixr: 12% gray"

### 3.4 Visual Progression

The app shows different stages of graying with pre-rendered images:
- 0-10% gray: Few scattered gray hairs
- 10-25% gray: Temples and sides showing gray
- 25-50% gray: Majority of temples, crown showing gray
- 50-75% gray: Most hair gray, some pigment remaining
- 75-100% gray: Fully white/gray hair

Each ethnicity/hair type combination has its own set of progression images.

---

## 4. Data Model & Logic

### 4.1 Whitening Rate Formula (Simplified)

Since there's no backend, we'll use a simple JavaScript formula:

```
baseRate = ethnicityFactor (Caucasian: 1.0, African American: 0.7, Middle Eastern: 0.85)

ageModifier = (currentAge - 20) * 0.5

stressModifier = stressLevel * 0.3 (0=low, 1=medium, 2=high)

sunModifier = sunExposure * 0.2

chemicalModifier = workEnvironment * 0.25 (0=indoor, 1=outdoor, 2=chemical)

smokingModifier = isSmoking ? 0.4 : 0

elixrModifier = isUsingElixr ? -0.7 : 0 (negative = reversal/slowing)

totalGrayPercentage = min(100, max(0,
  baseRate * (ageModifier + stressModifier + sunModifier + chemicalModifier + smokingModifier + elixrModifier)
))
```

### 4.2 Expected Deliverables from Science Team

To make this realistic, we need from Elixr's research team:

1. **Baseline whitening rates by ethnicity** (% gray per decade)
2. **Impact coefficients** for each lifestyle factor
3. **Elixr efficacy data**:
   - Expected slowing rate (e.g., "reduces whitening by 65%")
   - Reversal capability (e.g., "reverses 15-20% of existing gray")
   - Time to visible results

**For Prototype**: Use placeholder percentages that can be easily updated.

---

## 5. Technical Implementation

### 5.1 Technology Stack

- **HTML5**: Structure
- **CSS3**: Styling, animations
- **Vanilla JavaScript**: All logic (no frameworks for simplicity)
- **Optional**: Tailwind CSS or Bootstrap for quick styling

### 5.2 File Structure

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js (main logic)
│   ├── calculator.js (whitening calculations)
│   └── config.js (ethnicity data, parameters)
├── images/
│   ├── caucasian/
│   │   ├── straight-short/
│   │   │   ├── front-0.png (0% gray)
│   │   │   ├── front-25.png
│   │   │   ├── front-50.png
│   │   │   ├── front-75.png
│   │   │   └── front-100.png
│   │   │   └── (top, back views...)
│   │   └── curly-long/...
│   ├── african-american/...
│   └── middle-eastern/...
└── README.md
```

### 5.3 Image Requirements

**For MVP (Version 0.1)**
- 3 ethnicities × 4 hair types × 5 gray levels × 3 views = **180 images**
- Can reduce to 2 views (front + top) = **120 images**
- Can use stock photos or AI-generated faces
- Images should be consistent in:
  - Background (neutral)
  - Lighting
  - Head position
  - Resolution (suggest 800×800px)

**Image Sourcing Options**:
1. AI generation (Midjourney, DALL-E, Stable Diffusion)
2. Stock photo manipulation in Photoshop
3. Commission from designer
4. Use simplified illustrated avatars (easier to create variations)

---

## 6. UI/UX Design

### 6.1 Layout (Desktop)

```
┌────────────────────────────────────────────────────────┐
│  ELIXR Logo              Hair Whitening Simulator      │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐  │
│  │                 │    │  CONTROLS                 │  │
│  │                 │    │                           │  │
│  │   AVATAR        │    │  Age: [20 ←──○─→ 80]     │  │
│  │   DISPLAY       │    │                           │  │
│  │   (Front/Top/   │    │  Lifestyle Factors:       │  │
│  │    Back tabs)   │    │  □ Stress: [Low→High]    │  │
│  │                 │    │  □ Sun: [Low→High]       │  │
│  │                 │    │  □ Smoking: [Yes/No]     │  │
│  │                 │    │  □ Work: [Indoor/...]    │  │
│  └─────────────────┘    │                           │  │
│                         │  ┌────────────────────┐   │  │
│  Gray Hair at Age 45:   │  │  Using Elixr?      │   │  │
│  Without Elixr: 45%     │  │  [ YES ] [ NO ]    │   │  │
│  With Elixr: 12%        │  └────────────────────┘   │  │
│                         │                           │  │
│                         │  [Reset] [Share Results]  │  │
│                         └──────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Responsive
- Stack controls below avatar
- Single column layout
- Touch-friendly sliders

### 6.3 Color Scheme
- Professional, medical/scientific aesthetic
- Suggested palette:
  - Primary: Deep blue (#1E3A8A)
  - Accent: Elixr brand color
  - Background: Light gray/white
  - Success (for Elixr benefits): Green tones

---

## 7. Features by Version

### Version 0.1 (MVP - Target: Monday)
- ✅ Ethnicity selection (3 options)
- ✅ Hair type selection (2-4 options)
- ✅ Static avatar images (front view only, 5 gray levels)
- ✅ Age slider (20-80)
- ✅ 3-4 basic lifestyle parameters
- ✅ Elixr toggle
- ✅ Basic gray percentage calculation
- ✅ Simple, clean UI
- ✅ GitHub Pages deployment

### Version 0.2 (Post-Board Meeting)
- Multiple view angles (top, back)
- More detailed lifestyle parameters
- Smooth transitions between gray levels
- Data export/sharing capability
- Refined calculations with real research data

### Version 1.0 (Future)
- Photo upload for personalized simulation
- 3D head rotation
- Email results
- Backend for data collection (requires moving off GitHub Pages)
- Multi-language support

---

## 8. Content Requirements

### 8.1 Copy Needed
- Welcome screen introduction (2-3 sentences)
- Parameter explanations (tooltips)
- Results explanation text
- Disclaimer text about simulations being estimates

### 8.2 Scientific Data Needed
- Whitening rate data by ethnicity
- Impact factors for each lifestyle parameter
- Elixr efficacy percentages
- Citations/sources (optional, for credibility)

---

## 9. Success Metrics

For this prototype/demo version:
- ✅ App loads and runs smoothly
- ✅ All controls function correctly
- ✅ Visual progression is clear and realistic
- ✅ Elixr's impact is dramatically visible
- ✅ Board members can interact with it during presentation

---

## 10. Development Phases

### Phase 1: Foundation (4-6 hours)
- Set up HTML structure
- Create basic CSS styling
- Implement onboarding flow
- Set up image display system

### Phase 2: Core Logic (4-6 hours)
- Build calculation engine
- Wire up parameter controls
- Implement age slider
- Connect controls to image updates

### Phase 3: Polish (2-4 hours)
- Refine UI/UX
- Add transitions/animations
- Test across browsers
- Deploy to GitHub Pages

### Phase 4: Content (2-3 hours)
- Source or create images
- Write copy
- Add tooltips and help text

**Total Estimated Time: 12-19 hours** (doable over a weekend with focused effort)

---

## 11. Out of Scope (For v0.1)

- ❌ User accounts/login
- ❌ Data persistence (beyond browser session)
- ❌ Backend API
- ❌ Photo upload
- ❌ Social sharing (can add basic share links later)
- ❌ Mobile app
- ❌ Advanced 3D rendering
- ❌ Real-time collaboration
- ❌ Analytics tracking (can add Google Analytics easily later)

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Image creation takes too long | High | Use simplified illustrated avatars or stock photos |
| Calculation model not realistic | Medium | Use conservative estimates; update post-demo |
| Browser compatibility issues | Low | Test on Chrome, Safari, Firefox; use vanilla JS |
| Timeline too aggressive | High | Focus ruthlessly on MVP features only |

---

## 13. Next Steps

1. **Immediate** (Today/Tomorrow):
   - Approve this PRD
   - Provide Elixr efficacy data (percentages)
   - Decide on image strategy (AI-generated vs. illustrated vs. stock)

2. **Development** (Weekend):
   - Set up GitHub repository
   - Build core functionality
   - Source/create images
   - Deploy to GitHub Pages

3. **Review** (Monday):
   - Test with stakeholders
   - Gather feedback
   - Make quick iterations

4. **Demo** (Thursday):
   - Present to board
   - Collect feedback for v0.2

---

## 14. Open Questions

1. Do we have specific Elixr efficacy percentages to use?
2. What's the preferred image style (realistic photos vs. illustrations)?
3. Should we brand this heavily with Elixr branding or keep it neutral/educational?
4. Do we need any disclaimers about medical claims?
5. Is there existing research data we can reference or link to?

---

## Appendix: Technical Notes

### GitHub Pages Deployment
```bash
# Repository structure for GitHub Pages
# Main site will be at: https://[username].github.io/[repo-name]

# To deploy:
1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Select source: main branch, root folder
4. Site will be live in 1-2 minutes
```

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE11 support needed

### Performance Targets
- Initial load: < 3 seconds
- Image swap: < 100ms
- Calculation update: < 50ms (instant feel)
