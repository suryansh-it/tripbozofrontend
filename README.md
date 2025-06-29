
# 🌍 tripbozo Frontend

> A modern, responsive web application that curates personalized travel app bundles for destinations worldwide. Built with Next.js 14, React, and TailwindCSS for optimal performance and user experience.

![TripBozo Banner](public/logo.png)

## 🚀 What TripBozo Does

TripBozo is your essential travel companion that solves the problem of finding the right apps for your destination. Instead of spending hours researching which apps work best in each country, TripBozo provides:

- **🎯 Personalized App Recommendations**: Get curated app bundles based on your destination and travel style
- **📱 QR Code Sharing**: Generate shareable QR codes for your personalized app collections
- **🌐 Country-Specific Curation**: Expert-vetted app selections for 190+ countries
- **⚡ Progressive Web App**: Install and access offline for emergency situations
- **🔍 Smart Search**: Find the perfect apps for any destination instantly

### Key Features

- **Personalized Onboarding**: Tell us your travel style and get tailored recommendations
- **Expert Curation**: Professionally vetted app collections for every destination
- **Emergency PWA**: Critical offline access when you need it most
- **Social Sharing**: Share your app bundles with fellow travelers
- **Mobile-First Design**: Optimized for travelers on-the-go

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Frontend**: React 18 with modern hooks
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for responsive design
- **State Management**: React Context + SWR for data fetching
- **SEO**: Comprehensive structured data and meta optimization
- **PWA**: Full Progressive Web App capabilities
- **Performance**: Server-side rendering and incremental static regeneration

## 🏗️ Project Structure

```
├── components/           # Reusable UI components
│   ├── homepage/        # Homepage-specific components
│   ├── about/           # About page components
│   ├── AppCard.js       # Individual app display
│   ├── Navbar.js        # Navigation component
│   ├── Footer.js        # Footer component
│   ├── Loader.js        # Loading animations
│   └── SEO.js           # SEO and structured data
├── pages/               # Next.js pages (legacy structure)
├── src/
│   ├── app/            # Next.js App Router
│   └── utils/
│       └── api.js      # API integration functions
├── public/             # Static assets
│   ├── icons/          # PWA icons
│   └── logo.png        # Main logo
└── styles/             # Global styles and Tailwind config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/suryansh-it/tripbozofrontend.git
cd tripbozofrontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_USE_API=true

# SEO Configuration
NEXT_PUBLIC_SITE_URL=https://tripbozo.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 🔗 Backend Integration

This frontend integrates with the TripBozo backend API:

**Backend Repository**: [travel_buddy](https://github.com/suryansh-it/travel_buddy)

### API Endpoints Used

- `GET /countries/` - Fetch available countries
- `POST /personalized-list/` - Create personalized app bundle
- `GET /personalized-list/qr/{sessionId}/` - Generate QR code and shareable links

See [`src/utils/api.js`](src/utils/api.js) for complete API integration details.

## 🧭 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Utilities
npm run analyze      # Analyze bundle size
npm run export       # Export static site
```

## 📱 PWA Features

TripBozo is a full Progressive Web App:

- **Installable**: Add to home screen on mobile devices
- **Offline Capable**: Critical features work without internet
- **Background Sync**: Data syncs when connection restored
- **Push Notifications**: Travel alerts and updates (coming soon)

### PWA Setup

Icons and manifest are configured in [`public/manifest.json`](public/manifest.json). To generate all required icon sizes, use the logo from [`public/logo.png`](public/logo.png) with a tool like [Favicon Generator](https://realfavicongenerator.net/).

## 🎨 Design System

### Color Palette
- Primary: Blue gradient (`#38bdf8` to `#2ad2c9`)
- Secondary: Teal/Cyan accents
- Background: Light blue gradients
- Text: Professional grays

### Components
- Responsive design mobile-first
- Accessibility-compliant
- Consistent spacing using Tailwind utilities
- Loading states and error handling

## 🔍 SEO Implementation

tripbozo includes comprehensive SEO optimization:

- **Structured Data**: Schema.org markup for Organization, WebSite, and SoftwareApplication
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Performance**: Optimized images, lazy loading, and Core Web Vitals
- **Sitemap**: Automated sitemap generation
- **Mobile**: Responsive design with proper viewport settings

See [SEO_IMPLEMENTATION.md](SEO_IMPLEMENTATION.md) for detailed documentation.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/tripbozofrontend.git
cd tripbozofrontend
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Development Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### 4. Make Changes

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test PWA functionality

### 5. Submit Pull Request

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

### 📝 Contribution Guidelines

- **Code Style**: Follow the existing ESLint configuration
- **Components**: Create reusable, accessible components
- **Performance**: Optimize images and minimize bundle size
- **SEO**: Maintain structured data and meta tags
- **Mobile**: Ensure responsive design
- **Documentation**: Update README and comments

### 🐛 Bug Reports

Use the GitHub issue template and include:
- Browser and device information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Feature Requests

We love new ideas! Please include:
- Use case description
- Proposed solution
- Alternative approaches considered
- Implementation complexity estimate

## 📊 Performance

TripBozo is optimized for speed:

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with tree shaking
- **Images**: Next.js Image component with proper sizing

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration with backend
- Input validation and sanitization
- Secure headers in production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check our [Wiki](https://github.com/suryansh-it/tripbozofrontend/wiki)
- **Issues**: [GitHub Issues](https://github.com/suryansh-it/tripbozofrontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/suryansh-it/tripbozofrontend/discussions)
- **Email**: support@tripbozo.com

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel with automatic builds
```

### Manual Deployment

```bash
npm run build
npm run export  # For static export
# Deploy the `out` folder to your hosting provider
```

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Push notifications
- [ ] User accounts and favorites
- [ ] Travel itinerary integration
- [ ] AI-powered recommendations
- [ ] Community reviews and ratings

---

## 🌟 Star History

⭐ **Found TripBozo helpful?** Give us a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=suryansh-it/tripbozofrontend&type=Date)](https://star-history.com/#suryansh-it/tripbozofrontend&Date)

---

**Built with ❤️ by the TripBozo Team**

[🌐 Website](https://tripbozo.com) • [📧 Contact](mailto:support@tripbozo.com) • [🐦 Twitter](https://twitter.com/tripbozo)
=======


