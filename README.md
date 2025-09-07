# Mansa-to-Mansa Redesign

A beautiful, modern, and fully responsive website for the Mansa-to-Mansa non-profit organization. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

- **Modern Design**: Beautiful gradients, glassmorphism effects, and micro-interactions
- **Fully Responsive**: Perfect adaptation to all screen sizes and devices
- **Dark/Light Mode**: Seamless theme switching with next-themes
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Performance Optimized**: Built with Next.js 15 and React 19 for optimal performance
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support

## 🎨 Design Highlights

### Navigation
- Floating glassmorphism navigation header
- Smooth scroll-based backdrop blur effects
- Mobile-first responsive design with slide-out menu
- Theme toggle with smooth transitions

### Hero Section
- Animated background with floating shapes
- Gradient text effects and underline animations
- Interactive call-to-action buttons with hover effects
- Community stats with icon animations
- Scroll indicator with breathing animation

### Community Section
- Card hover effects with scale and shadow transitions
- Gradient-based feature cards
- Interactive statistics display
- Responsive grid layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd mansa-redesign
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **React**: React 19
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes
- **TypeScript**: Full TypeScript support
- **Fonts**: Inter & Poppins from Google Fonts

## 📱 Responsive Design

The website is designed to look stunning on all devices:

- **Mobile**: 320px and up
- **Tablet**: 768px and up  
- **Desktop**: 1024px and up
- **Large Desktop**: 1440px and up

## 🎨 Design System

### Colors
- **Primary**: Emerald (green) - representing growth and community
- **Secondary**: Blue - representing trust and global reach
- **Gradients**: Multiple gradient combinations for visual interest

### Typography
- **Headings**: Poppins font family
- **Body**: Inter font family
- **Responsive**: Fluid typography scaling

### Animations
- **Page load**: Staggered animations for content reveal
- **Scroll**: Intersection Observer based animations
- **Hover**: Micro-interactions on buttons and cards
- **Theme**: Smooth transitions between light/dark modes

## 📁 Project Structure

```
mansa-redesign/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── about/          # About page
│   │   ├── community/      # Community page
│   │   ├── projects/       # Projects page
│   │   ├── signup/         # Signup page
│   │   ├── team/           # Team page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   └── components/
│       ├── layout/         # Layout components
│       │   └── Navigation.tsx
│       ├── providers/      # Context providers
│       │   └── ThemeProvider.tsx
│       └── sections/       # Page sections
│           ├── HeroSection.tsx
│           └── CommunitySection.tsx
├── public/                 # Static assets
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 🌟 Key Components

### Navigation
- Responsive navigation with mobile menu
- Theme toggle functionality
- Smooth scroll effects
- Glassmorphism design

### Hero Section
- Animated background elements
- Gradient text effects
- Call-to-action buttons
- Community statistics
- Scroll indicator

### Community Section
- Feature cards with hover effects
- Gradient backgrounds
- Interactive elements
- Responsive grid layout

## 🎯 Performance Features

- **Next.js 15**: Latest features and optimizations
- **React 19**: Improved performance and developer experience
- **Image Optimization**: Automatic image optimization
- **Font Optimization**: Automatic font loading optimization
- **Code Splitting**: Automatic code splitting for faster loads
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size

## 🔧 Customization

The design system is built with customization in mind:

1. **Colors**: Modify colors in `tailwind.config.js`
2. **Fonts**: Update font imports in `layout.tsx`
3. **Animations**: Customize animations in `globals.css`
4. **Components**: All components are modular and reusable

## 📈 Future Enhancements

- Add more page sections (testimonials, impact stories, etc.)
- Implement blog functionality
- Add member portal integration
- Include project showcase galleries
- Integrate with CMS for content management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Mansa-to-Mansa community**