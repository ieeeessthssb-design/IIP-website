# IEEE ESSTHS IIP Website - Webmaster Quick Start Guide

**For**: IEEE ESSTHS Webmaster  
**Purpose**: Maintain and update the Joint Chapter website  
**Complexity**: Beginner-friendly (no coding required for most updates)

---

## 🚀 Getting Started

### First Time Setup
1. Clone or download the project from GitHub
2. Open `index.html` in your web browser
3. Test that the hero particle system animates
4. Proceed with customization below

### Publishing the Website
- **GitHub Pages**: Push files to GitHub, go to Settings → Pages
- **Netlify**: Drag & drop folder into Netlify.com
- **Your Server**: FTP/SFTP the files

---

## 📝 Common Tasks

### Task 1: Add a New Event

**Location**: Bottom of `index.html` (search for `events-manifest`)

**Find this section:**
```html
<script id="events-manifest" type="application/json">
[
  {
    "name": "[EVENT_TITLE_1]",
    ...
  }
]
</script>
```

**To add an event:**
1. Add a comma after the last event (if there are existing events)
2. Copy and paste this template:

```json
{
  "name": "My Workshop Title",
  "society": "IAS",
  "status": "upcoming",
  "src": "assets/event-placeholder.jpg"
}
```

3. Replace values:
   - `"name"`: Your event title
   - `"society"`: `"IAS"`, `"IES"`, or `"PES"`
   - `"status"`: `"upcoming"` or `"past"` (for archive)
   - `"src"`: Path to event image

**Example:**
```json
{
  "name": "Introduction to Smart Grids",
  "society": "PES",
  "status": "upcoming",
  "src": "assets/smart-grids-workshop.jpg"
}
```

**Test:**
1. Save the file
2. Refresh your browser
3. Check if the event appears in the correct section
4. Click the society filter to verify filtering works

---

### Task 2: Update Team Members

**Location**: Search for `<!-- Joint Chapter Leadership -->` in `index.html`

**Find a team member card:**
```html
<article class="member-card reveal-up" style="--accent: #39FF88">
  <span class="node-index">01</span>
  <img class="member-photo" src="assets/person-placeholder.svg" alt="[NAME] - Chair" />
  <span class="member-initial">✦</span>
  <div class="member-info">
    <h3>[NAME]</h3>
    <p>Chair</p>
  </div>
</article>
```

**To update:**
1. Replace `[NAME]` with actual name
2. Update `alt="..."` text with name
3. Replace image path: `src="assets/person-placeholder.svg"` → `src="assets/john-doe.jpg"`
4. Update role: `<p>Chair</p>` → `<p>Your Role</p>`
5. Optional: Change color `--accent` to different green: `#39FF88`, `#86EFAC`, `#4ADE80`, `#16A34A`

**Color meanings:**
- `#39FF88` - Bright electric green
- `#86EFAC` - Lighter green  
- `#4ADE80` - Medium green
- `#16A34A` - Dark green

---

### Task 3: Replace Logos and Images

**Before you start:**
- Prepare your images (SVG for logos, JPG/PNG for photos)
- Keep file names simple (no spaces)
- Save in `assets/` folder

**Files to replace:**

| Original | Replacement | Type | Size |
|---|---|---|---|
| `assets/iip-logo-placeholder.svg` | Your chapter logo | SVG | 128x128px |
| `assets/ias-placeholder.svg` | IAS society logo | SVG | 64x64px |
| `assets/ies-placeholder.svg` | IES society logo | SVG | 64x64px |
| `assets/pes-placeholder.svg` | PES society logo | SVG | 64x64px |
| `assets/person-placeholder.svg` | Team member photos | JPG/PNG | 256x256px |
| `assets/event-placeholder.jpg` | Event images | JPG | 400x500px |
| `assets/ieee-icon.png` | Favicon | PNG | 192x192px |

**Steps:**
1. Replace the file in `assets/` folder
2. Keep the same filename (or update all references in HTML)
3. Test the page - images should load

---

### Task 4: Update Contact Information

**Location**: Search for `Open the circuit` in `index.html`

**Find:**
```html
<form class="contact-form" novalidate data-contact-form action="https://formsubmit.co/ajax/[EMAIL]" method="POST">
```

**Update:**
1. Replace `[EMAIL]` with your actual email
   - Example: `action="https://formsubmit.co/ajax/iip@essths.edu"`
2. Save and test the form

**What happens:**
- When someone submits, you'll receive an email
- First submission requires verification (formsubmit.co will send verification link)

**Alternative:**
- If you prefer a different service (Formspree, Netlify Forms), update the action URL

---

### Task 5: Update Chapter Description

**Location**: Search for `<!-- [01] The System -->` in `index.html`

**Find:**
```html
<p>
  The IEEE ESSTHS Joint Chapter for Industrial Applications...
</p>
```

**Replace with your text:**
1. Keep it professional and accurate
2. Mention the three societies (IAS, IES, PES)
3. Keep length to 2-3 sentences

---

### Task 6: Update Society Information

**Location**: Search for `<!-- [02] Three Pillars -->` in `index.html`

**For each society (IAS, IES, PES):**

1. Update description:
```html
<p class="pillar-description">
  [DESCRIPTION HERE]
</p>
```

2. Update focus areas list:
```html
<li>Focus area 1</li>
<li>Focus area 2</li>
<li>Focus area 3</li>
<li>Focus area 4</li>
```

3. Update website link:
```html
<a href="https://www.ieee-ias.org" class="pillar-link">Learn more →</a>
```

**Example:**
```html
<p class="pillar-description">
  Focused on the theory and practice of industrial electronics systems.
</p>
<ul class="focus-list">
  <li>Power electronics</li>
  <li>Motion control</li>
  <li>Robotics</li>
  <li>Smart manufacturing</li>
</ul>
```

---

### Task 7: Update Focus Areas

**Location**: Search for `<!-- [03] Engineering Frontiers -->` in `index.html`

**Current areas (8 items):**
```html
<div class="focus-item reveal-up">
  <span class="focus-label">POWER SYSTEMS</span>
  <span class="focus-icon">⚡</span>
</div>
```

**To update:**
1. Keep all 8 items (or edit CSS for different number)
2. Update label: `POWER SYSTEMS` → `YOUR TOPIC`
3. Update icon: `⚡` → Other emoji

**Suggested emojis:**
- ⚡ Power/Electricity
- 🔌 Electrical
- ⚙️ Mechanics/Automation
- 🤖 Robotics
- 📊 Data/Systems
- 🔋 Energy Storage
- 🌱 Sustainability
- 🏭 Manufacturing

---

### Task 8: Update Footer

**Location**: Search for `<!-- Footer -->` in `index.html`

**Marquee ticker:**
```html
<span>IEEE ESSTHS IAS · IES · PES <b>//</b> Power · Industry · Electronics <b>//</b></span>
```

**To customize:**
Replace text between IAS·IES·PES and the second `//`

**Example:**
```html
<span>IEEE ESSTHS IAS · IES · PES <b>//</b> Energy · Innovation · Technology <b>//</b></span>
```

---

## 🎨 Styling Adjustments (Intermediate)

### Change the Green Color

**Location**: Top of `styles.css` (in `:root { }` section)

**Current:**
```css
:root {
  --pulse: #39FF88;        /* Main green */
  --pulse-dim: #16A34A;    /* Dark green */
  --pulse-glow: #86EFAC;   /* Bright green */
  /* ... other colors ... */
}
```

**To adjust:**
1. Keep the structure the same
2. Replace hex codes with your colors
3. Use a color picker tool (https://htmlcolorcodes.com)

**Example (teal theme):**
```css
--pulse: #14b8a6;        /* Teal */
--pulse-dim: #0d9488;    /* Dark teal */
--pulse-glow: #2dd4bf;   /* Bright teal */
```

---

### Adjust Spacing and Padding

**Location**: Various places in `styles.css`

**Common properties:**
- `padding`: Space inside elements
- `margin`: Space outside elements
- `gap`: Space between grid items

**Example:**
```css
.section-inner {
  padding: 80px 24px;  /* Increase first number for more vertical space */
}
```

---

## 🔧 Troubleshooting

### Problem: Images not showing
**Solution:**
1. Check file path is correct in HTML
2. Verify image exists in `assets/` folder
3. Check filename matches exactly (case-sensitive)
4. Refresh browser (Ctrl+F5)

### Problem: Hero particles not animating
**Solution:**
1. Check browser console for errors (F12)
2. Ensure `<canvas class="particle-canvas">` exists in HTML
3. Check that `main.js` is loaded (F12 → Network tab)

### Problem: Contact form not working
**Solution:**
1. Verify email address in form action
2. Check that you completed verification link from formsubmit.co
3. Test with different email client (spam folder?)
4. Try alternative service (Formspree)

### Problem: Layout looks broken on mobile
**Solution:**
1. Check `viewport` meta tag exists: `<meta name="viewport">`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Test in different mobile browser
4. Reduce browser zoom to 100%

---

## 📊 Analytics & Tracking (Optional)

To add Google Analytics:

1. Get tracking code from Google Analytics
2. Add this before `</head>` tag in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your code.

---

## 🔐 Security Checklist

Before deploying:
- [ ] No sensitive information in code comments
- [ ] Contact form email is correct and verified
- [ ] No hardcoded passwords or API keys
- [ ] All external links use HTTPS
- [ ] File permissions allow read-only for visitors

---

## 📱 Testing Your Changes

### Desktop Testing
1. Open website in Chrome, Firefox, Safari
2. Resize browser window (test different widths)
3. Check all links work
4. Test contact form submission

### Mobile Testing
1. Use phone/tablet to visit website
2. Test mobile menu toggle
3. Check event cards scroll properly
4. Verify forms work on mobile

### Browser DevTools (F12)
1. Go to Device toolbar (mobile view)
2. Test at: 375px, 768px, 1024px, 1440px
3. Check for console errors
4. Verify CSS loads correctly

---

## 📞 When to Ask for Help

**Technical Issues:**
- Particle system not working
- JavaScript errors in console
- Responsive layout broken
- Performance problems

**Design Questions:**
- Color scheme changes
- Major layout modifications
- Adding new sections

**Support Resources:**
- README.md - Comprehensive guide
- BUILD_SUMMARY.md - Technical details
- HTML/CSS/JS - Read inline comments

---

## 🎯 Before Launch Checklist

- [ ] Add real chapter logo
- [ ] Add society logos (IAS, IES, PES)
- [ ] Add team member photos
- [ ] Add first event
- [ ] Update contact email
- [ ] Verify all links work
- [ ] Test mobile layout
- [ ] Test contact form
- [ ] Check spelling/grammar
- [ ] Get manager approval
- [ ] Deploy to live server

---

## 🚀 Deployment Steps

### GitHub Pages (Easiest)
1. Create GitHub account (free)
2. Create repository named `iip-website`
3. Upload project files
4. Settings → Pages → Deploy from main
5. Your site is live at `username.github.io/iip-website`

### Netlify
1. Go to Netlify.com
2. Drag & drop project folder
3. Site auto-deploys
4. Add custom domain in settings

### Your Own Server
1. Connect via FTP
2. Upload all files to public_html/
3. Make sure `index.html` is in root directory
4. Test in browser

---

## 💡 Pro Tips

1. **Backup before changes**: Keep a copy of working version
2. **Test locally first**: Make changes, test in browser before uploading
3. **Use browser DevTools**: F12 to debug CSS/JavaScript issues
4. **Keep file structure**: Don't move files around unnecessarily
5. **Version naming**: When updating events, use descriptive names
6. **Image optimization**: Compress images before uploading for faster load
7. **Mobile first**: Always test changes on mobile
8. **Document changes**: Keep notes of what you update

---

## 📚 Further Learning

If you want to learn more:
- **HTML**: https://mdn.mozilla.org/en-US/docs/Web/HTML
- **CSS**: https://mdn.mozilla.org/en-US/docs/Web/CSS
- **JavaScript**: https://mdn.mozilla.org/en-US/docs/Web/JavaScript
- **Web Hosting**: Netlify.com, GitHub Pages, Vercel

---

## ✅ You're Ready!

The website is production-ready. Start with the common tasks above and gradually explore the code. Don't hesitate to experiment—you can always revert changes.

**Happy web mastering! 🚀**

---

*For technical support, refer to README.md or contact the Joint Chapter leadership.*
