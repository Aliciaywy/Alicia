# 🌊 ShoreSquad - Beach Cleanup Coordination

<div align="center">

![ShoreSquad Logo](https://img.shields.io/badge/🌊-ShoreSquad-blue?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/🔗-Live%20Demo-success?style=for-the-badge)](https://aliciaywy.github.io/ShoreSquad)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Aliciaywy/Alicia.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Rally your crew, track weather, and hit the next beach cleanup with our interactive map app!*

</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## Overview

ShoreSquad creates value by mobilizing young people to clean beaches, using weather and maps for easy planning and social features to make eco-action fun and connected. Our platform combines real-time weather data, interactive mapping, and social coordination to make beach cleanups more effective and engaging.

### 🎯 Current Cleanup Location
**Pasir Ris Beach, Singapore**
- 📍 **Meeting Point**: Street View Asia (1.381497, 103.955574)
- 🕐 **Time**: Next Weekend, 8:00 AM - 12:00 PM
- 👥 **Volunteers**: 23+ signed up

## 🌟 Features

### Core Functionality
- **🌤️ Smart Weather Tracking** - Real-time weather updates from Singapore's NEA
- **👥 Crew Coordination** - Rally friends and connect with environmental warriors
- **🗺️ Interactive Maps** - Google Maps integration for cleanup locations
- **📊 Impact Tracking** - See your environmental impact grow
- **📱 Mobile Responsive** - Perfect for on-the-go planning

### User Experience
- **🎨 Ocean-themed Design** - Beautiful, intuitive interface
- **♿ Accessibility First** - WCAG compliant with ARIA labels
- **🌐 Multi-device Support** - Works on desktop, tablet, and mobile
- **⚡ Fast Performance** - Optimized for quick loading

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Poppins Font** - Modern typography

### APIs & Integrations
- **Singapore NEA Weather API** - Real-time weather data
- **Google Maps API** - Interactive mapping
- **REST APIs** - Data communication

### Development Tools
- **Node.js** - Development server
- **Express.js** - Backend framework
- **Live Server** - Development hot reload
- **Nodemon** - Automatic server restart

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser
- Internet connection for API calls

### Quick Start
1. **Visit the Live Demo**: [https://aliciaywy.github.io/ShoreSquad](https://aliciaywy.github.io/ShoreSquad)
2. **Check Weather Forecast** - Plan your cleanup based on conditions
3. **View Interactive Map** - Find the next cleanup location
4. **Join the Event** - Connect with other volunteers!

## 💻 Installation

### Clone the Repository
```bash
git clone https://github.com/Aliciaywy/Alicia.git
cd Alicia
```

### Install Dependencies
```bash
npm install
```

### Environment Setup
1. Create a `.env` file in the root directory
2. Add your API keys:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEA_API_KEY=your_nea_weather_api_key
```

### Run Development Server
```bash
# Start the Express server
npm run dev

# Or serve static files
npm run serve
```

### Build for Production
```bash
npm run build
```

## 📖 Usage

### For Event Organizers
1. **Set Cleanup Location** - Use the map interface to mark cleanup spots
2. **Monitor Weather** - Check real-time conditions for safety
3. **Track Volunteers** - See who's joining your event
4. **Share Event Details** - Send location and time to participants

### For Volunteers
1. **Find Events** - Browse upcoming beach cleanups
2. **Check Weather** - Prepare appropriate gear
3. **Navigate to Location** - Use integrated maps for directions
4. **Track Impact** - See your contribution to ocean health

## 📁 Project Structure

```
ShoreSquad/
├── 📄 Index.html              # Main application entry point
├── 📄 package.json            # Node.js dependencies and scripts
├── 📄 README.md              # Project documentation
├── 📁 css/
│   └── 📄 styles.css         # Application styling
├── 📁 js/
│   └── 📄 app.js             # Main JavaScript functionality
├── 📁 data/
│   └── 📄 tips.json          # Environmental tips and data
└── 📁 server/
    └── 📄 index.js           # Express server configuration
```

## 🔧 API Documentation

### Weather API Integration
- **Endpoint**: Singapore NEA Weather API
- **Data**: Real-time temperature, humidity, rainfall
- **Update Frequency**: Every 30 minutes
- **Format**: JSON response with metric units

### Maps Integration
- **Service**: Google Maps JavaScript API
- **Features**: Interactive maps, markers, directions
- **Customization**: Ocean-themed styling
- **Performance**: Lazy loading for optimal speed

## 📊 Impact Statistics

Our community has achieved incredible results:

- 🏖️ **1,500+** beaches cleaned
- 👥 **25,000+** volunteers mobilized
- ♻️ **22,700+ kg** trash collected
- 🌏 **15+** countries participating

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ES6+ JavaScript standards
- Maintain mobile-first responsive design
- Write accessible HTML with ARIA labels
- Test across multiple browsers
- Document new features

### Areas for Contribution
- 🐛 Bug fixes and improvements
- 🎨 UI/UX enhancements
- 🌐 Internationalization
- 📱 PWA features
- 🔒 Security improvements

## 📱 Mobile Experience

ShoreSquad is designed mobile-first for young environmentalists who are always on the go. The website works perfectly on smartphones and tablets with:

- **Touch-optimized Interface** - Easy navigation on small screens
- **Offline Capabilities** - Basic functionality without internet
- **GPS Integration** - Location-based features
- **Push Notifications** - Event reminders and updates

## 🔒 Privacy & Security

- **Data Protection** - No personal data stored without consent
- **Secure APIs** - All external calls use HTTPS
- **Location Privacy** - GPS data processed locally
- **GDPR Compliant** - European privacy standards

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Aliciaywy/Alicia/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aliciaywy/Alicia/discussions)
- **Email**: shoresquad@environmental.org
- **Social**: [@ShoreSquad](https://twitter.com/shoresquad)

## 🙏 Acknowledgments

- **NEA Singapore** - Weather data API
- **Google Maps** - Mapping services
- **Open Source Community** - Various libraries and tools
- **Environmental Partners** - Local cleanup organizations
- **Our Volunteers** - The heart of ShoreSquad

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

If you find ShoreSquad helpful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=Aliciaywy/Alicia&type=Date)](https://star-history.com/#Aliciaywy/Alicia&Date)

---

<div align="center">

**Made with 💙 for our oceans** | **© 2025 ShoreSquad. All rights reserved.**

[⬆ Back to Top](#-shoresquad---beach-cleanup-coordination)

</div>
