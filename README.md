# IEEE ESSTHS IAS · IES · PES Joint Chapter Website

A premium, interactive website for the IEEE ESSTHS Student Branch Joint Chapter representing the Industrial Applications Society (IAS), Industrial Electronics Society (IES), and Power & Energy Society (PES).

## Features

- **Interactive Electrical Energy Particle System**: A dynamic hero with electrical nodes, energy connections, and animated pulses that respond to mouse interaction
- **Three Pillar Section**: Visual representation of IAS, IES, and PES with their focus areas and external links
- **Event Management**: Data-driven event system with filtering by society (IAS, IES, PES)
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Premium Dark Aesthetic**: Electric green color scheme with sophisticated animations
- **Accessibility**: Full keyboard navigation, reduced motion support, semantic HTML
- **Performance**: Optimized particle system, lazy loading, minimal dependencies

## Project Structure

```
iip-website/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── main.js             # Interactive features and particle system
├── manifest.json       # PWA manifest
├── assets/
│   ├── iip-logo-placeholder.svg      # Main logo (replace with actual)
│   ├── ias-placeholder.svg           # IAS society icon
│   ├── ies-placeholder.svg           # IES society icon
│   ├── pes-placeholder.svg           # PES society icon
│   ├── person-placeholder.svg        # Team member placeholder
│   ├── event-placeholder.jpg         # Event image placeholder
│   └── ieee-icon.png                 # Favicon and PWA icon
└── README.md           # This file
```

## Quick Start

1. **Clone or download** the repository
2. **Open `index.html`** in a modern web browser
3. No build process or server required—works on any static host

## Customization Guide

### 1. Replace Logos and Assets

Replace placeholder images with actual assets:

- `assets/iip-logo-placeholder.svg` → Your chapter logo
- `assets/ias-placeholder.svg` → IAS society logo
- `assets/ies-placeholder.svg` → IES society logo
- `assets/pes-placeholder.svg` → PES society logo
- `assets/ieee-icon.png` → Favicon and PWA icon
- `assets/person-placeholder.svg` → Team member photos (or use JPG)
- `assets/event-placeholder.jpg` → Event featured images

### 2. Update Chapter Information

Edit the following in `index.html`:

**Hero Section:**
```html
<span class="pulse-text">IAS · IES · PES</span>
```

**Contact Form Email:**
```html
<form ... action="https://formsubmit.co/ajax/[EMAIL]" ...>
```

Replace `[EMAIL]` with your actual contact email.

### 3. Add and Manage Events

Events are stored in an inline JSON manifest at the end of `index.html`:

```html
<script id="events-manifest" type="application/json">
[
  {
    "name": "[EVENT_TITLE]",
    "society": "IAS",        // or "IES", "PES"
    "status": "upcoming",    // or "past"
    "src": "assets/event-placeholder.jpg"
  }
]
</script>
```

**To add an event:**

1. Find the `<script id="events-manifest">` section
2. Add a new object to the array
3. Set `name`, `society`, `status`, and `src`

**Example:**

```json
{
  "name": "Power Systems Workshop",
  "society": "PES",
  "status": "upcoming",
  "src": "assets/workshop-power.jpg"
}
```

The filtering system automatically handles display based on society selection.

### 4. Update Team Members

Edit the team section in `index.html`:

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

Replace `[NAME]` with actual names and update the image src with team member photos.

**Color coding** is done via `--accent` CSS variable (e.g., `#39FF88`, `#86EFAC`, `#4ADE80`, `#16A34A`).

### 5. Update Section Content

All text content is directly editable in `index.html`. Key sections:

- **About Section**: Lines ~107-120
- **Three Pillars**: Lines ~132-200 (descriptions and links)
- **Focus Areas**: Lines ~208-240
- **Contact Copy**: Lines ~336-339

### 6. Color System

All colors are defined as CSS variables in `styles.css`:

```css
:root {
  --void: #050806;                    /* Black background */
  --surface: #0B120D;                 /* Dark surface */
  --pulse: #39FF88;                   /* Electric green */
  --pulse-dim: #16A34A;               /* Darker green */
  --pulse-glow: #86EFAC;              /* Bright green */
  --steel: #7A8A7D;                   /* Muted gray-green */
  --white: #F5F5F5;                   /* Off-white text */
}
```

Modify these values to adjust the entire visual theme.

## Particle System

The hero features a sophisticated electrical energy particle system with:

- **Electrical Nodes**: Glowing particles representing network substations
- **Energy Connections**: Lines connecting nearby nodes
- **Energy Pulses**: Animated glowing trails traveling along connections
- **Mouse Interaction**: Nodes respond to cursor movement, creating electrical disturbance

The system is optimized for performance and includes:
- Reduced particle count on mobile devices
- Support for `prefers-reduced-motion`
- RequestAnimationFrame-based rendering
- Distance-based connection calculations

**To adjust particle behavior**, modify these values in `main.js`:

```javascript
const count = Math.min(100, Math.ceil((width * height) / 25000));  // Particle count
const linkDistance = 140 * dpr;  // Connection distance
const pointerDistance = 180 * dpr;  // Interaction radius
```

## Responsive Behavior

The website is fully responsive:

- **Desktop (1200px+)**: Full navigation, multi-column layouts
- **Tablet (768-1199px)**: Optimized spacing, adjusted card sizes
- **Mobile (< 768px)**: Hamburger menu, simplified particle system, stacked layouts

Test on various devices to ensure optimal experience.

## Performance Optimization

- **Canvas Rendering**: Particle system uses OffscreenCanvas and requestAnimationFrame
- **Event Delegation**: Single event listeners for filtered events
- **CSS Animations**: GPU-accelerated transforms and opacity
- **Lazy Loading**: Intersection Observer for reveal animations
- **No Dependencies**: Pure JavaScript, no frameworks

**Monitor performance:**

1. Open DevTools (F12)
2. Go to Performance tab
3. Record while scrolling and interacting
4. Check FPS and CPU usage (target: 60 FPS)

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Upload project files to `main` branch
3. Go to Settings → Pages
4. Select "Deploy from a branch" → `main` branch
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify

1. Drag and drop the project folder into Netlify
2. Automatic HTTPS and CDN distribution
3. Custom domain support

### Traditional Web Server

1. Upload all files to your web server
2. Ensure MIME types are correct (`.js`, `.css`, `.json`)
3. No server-side processing required

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

Requires ES6+ JavaScript support.

## Accessibility

The website includes:

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Focus indicators
- ✅ Color contrast compliance (WCAG AA)
- ✅ Reduced motion support
- ✅ Alt text for all images
- ✅ Form validation feedback

Test with:

```bash
# Using WAVE browser extension (recommended)
# or axe DevTools from Deque
```

## Contact Form

The contact form uses **formsubmit.co** for email delivery:

1. Replace `[EMAIL]` in the form action with your email
2. The form will prompt for email verification on first submission
3. Configure spam protection and redirects at formsubmit.co

**Alternative services:**
- Formspree.io
- Basin.io
- Getform.io

## Troubleshooting

**Hero particles not showing?**
- Check that `<canvas class="particle-canvas">` exists
- Verify browser supports Canvas API
- Check browser console for errors

**Contact form not working?**
- Ensure email in form action is correct
- Check formsubmit.co for spam settings
- Test in private/incognito mode

**Events not displaying?**
- Verify JSON in `events-manifest` script is valid
- Check that `status` field is exactly "upcoming" or "past"
- Ensure image paths are correct

**Styling issues on mobile?**
- Clear browser cache (Ctrl+Shift+Delete)
- Test in multiple mobile browsers
- Check viewport meta tag in `<head>`

## Future Enhancements

Potential additions:

- Blog/News section for announcements
- Photo gallery from past events
- Technical resources/library
- Social media feed integration
- Event registration system
- Member directory with profiles
- Dark/light theme toggle
- Multi-language support

## Credits

**Design & Development**: IEEE ESSTHS Joint Chapter Webmaster  
**Based on**: IEEE ESSTHS Computer Society Chapter website architecture  
**Color System**: Electric green energy theme  
**Typography**: Plus Jakarta Sans (body), JetBrains Mono (code)

## License

This website is the property of IEEE ESSTHS Student Branch. All rights reserved.

For questions or contributions, contact the Joint Chapter leadership.

---

**Last Updated**: 2026  
**Version**: 1.0
