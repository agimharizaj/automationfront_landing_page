# AutomationFront - Diagnostic Tool

A professional diagnostic tool helping startup founders identify automation opportunities and estimate time savings.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## ⚙️ Configuration Before Launch

### 1. Email Capture (Formspree)
1. Sign up for free at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID (looks like `abc123xyz`)
4. In `ResultsView.tsx`, replace `YOUR_FORM_ID` with your actual ID:
```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

### 2. Calendly Booking
1. Sign up for free at [calendly.com](https://calendly.com)
2. Create a "30 Minute Meeting" event
3. Copy your scheduling link
4. In `ResultsView.tsx`, replace the Calendly URL:
```typescript
<a href="https://calendly.com/YOUR-CALENDLY-LINK/30min"
```

### 3. Personal Information
Update these files with your real information:

**About.tsx:**
- Update LinkedIn URL: `https://linkedin.com/in/YOUR-LINKEDIN-USERNAME`

**Footer.tsx:**
- Update contact email
- Update LinkedIn URL

### 4. Optional: Replace Logo Placeholder
If you want a custom photo instead of the "A" logo in About section, replace the gradient div with an image in `About.tsx`.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your site will be live at `your-project.vercel.app`

### Custom Domain

1. Buy domain at Namecheap or similar (e.g., `automationfront.com`)
2. In Vercel dashboard, go to Settings → Domains
3. Add your custom domain
4. Update DNS records as shown in Vercel

## 📊 Analytics

The app includes basic console logging for tracking:
- Diagnostic starts
- Diagnostic completions
- Completion rate

To add proper analytics, integrate Plausible or Simple Analytics.

## 🛠️ Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Vite
- jsPDF (for PDF generation)
- Formspree (for email capture)

## 📝 TODO Before Launch

- [ ] Set up Formspree and update form ID
- [ ] Set up Calendly and update booking link
- [ ] Update LinkedIn URLs in About and Footer
- [ ] Update contact email in Footer
- [ ] Test full diagnostic flow
- [ ] Test email capture
- [ ] Test PDF download
- [ ] Deploy to Vercel
- [ ] Connect custom domain
- [ ] Test on mobile devices

## 📞 Support

For issues or questions, email: contact@automationfront.com

## 🇬🇧 Localisation

This application is optimised for British English spelling and terminology.
