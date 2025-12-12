# 🌍 Travel Diaries - Smart Trip Planner

A beautiful, modern travel planning application built with **Next.js** that helps you plan your perfect trip with intelligent budget allocation and distance calculations.

![Travel Diaries](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Destination Selection
- Choose from **20+ major cities** worldwide
- Clean, intuitive hero interface
- Beautiful animations and transitions

### 📍 Origin & Distance Calculation
- **Manual city selection** from a curated list
- **Geolocation API** integration - "Use My Location" button for automatic detection
- **Haversine formula** for accurate distance calculations
- Supports both manual input and GPS coordinates

### 💰 Smart Budget Management
- Enter your total trip budget
- **Multi-currency support**:
  - USD ($)
  - EUR (€)
  - GBP (£)
  - JPY (¥)
  - AED
  - INR (₹)
- Automatic currency conversion and calculations

### 🏨 Intelligent Itinerary Generation

#### Trip Overview Dashboard
- **Distance** between origin and destination
- **Estimated travel time** (based on average flight speed)
- **Budget breakdown** visualization

#### Where to Stay (40% Budget Allocation)
- Hotels and hostels matching your budget
- Ratings and reviews
- Price per night in your selected currency
- Different accommodation types:
  - Luxury Hotels
  - Boutique Hotels
  - Mid-Range Hotels
  - Budget Hotels
  - Hostels

#### Places to Visit (60% Budget Allocation)
- Tourist attractions within budget
- Free and paid activities
- Category tags (Landmark, Museum, Historic Site, Nature, etc.)
- Estimated duration for each activity
- Smart filtering based on entry fees

## 🎨 Design Features

- **Premium UI/UX** with modern aesthetics
- **Black & Orange Theme** - sleek and vibrant
- **Glassmorphism** effects
- **Smooth animations** and micro-interactions
- **Responsive design** - works on all devices
- **Custom scrollbars** matching the theme
- **Gradient text** and glow effects

## 🚀 Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Beautiful icons
- **Geolocation API** - Browser location detection
- **Custom CSS animations** - Smooth transitions

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd travel-diaries

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺️ Supported Cities

The application includes realistic mock data for the following destinations:

**Americas**: New York, Los Angeles, Toronto, Mexico City

**Europe**: London, Paris, Rome, Barcelona, Amsterdam, Berlin, Istanbul

**Asia**: Tokyo, Dubai, Singapore, Mumbai, Delhi, Bangkok, Hong Kong, Seoul

**Oceania**: Sydney

## 💡 How It Works

### Distance Calculation
Uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * π / 180;
  const dLon = (lon2 - lon1) * π / 180;
  const a = sin(dLat/2)² + cos(lat1) * cos(lat2) * sin(dLon/2)²;
  const c = 2 * atan2(√a, √(1-a));
  return R * c;
}
```

### Budget Allocation
- **40%** allocated to accommodations (hotels/hostels)
- **60%** allocated to attractions and activities
- Automatic currency conversion using real exchange rates
- Filters options based on per-night/per-entry costs

### Travel Time Estimation
- Assumes average commercial flight speed of **800 km/h**
- Calculates flight duration based on great-circle distance
- Displays in hours format

## 🎯 User Flow

1. **Enter Destination** - Select where you want to go
2. **Set Origin** - Choose your starting city OR use geolocation
3. **Input Budget** - Enter total budget and select currency
4. **Generate Itinerary** - Click "Plan My Trip"
5. **View Results** - See personalized trip overview, hotels, and attractions
6. **Plan Another Trip** - Reset and start over

## 🔮 Future Enhancements

- Google Maps API integration for real-time data
- Flight booking integration
- Multi-day itinerary planning
- Weather forecasts
- User accounts and saved trips
- Social sharing features
- Real hotel and attraction data via APIs
- Transportation cost calculations
- Restaurant recommendations

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Color Palette

```css
Primary: #ff5500 (Vibrant Orange)
Background: #000000 (Pure Black)
Card Background: #0a0a0a (Dark Charcoal)
Text Primary: #ffffff (White)
Text Secondary: #888888 (Gray)
Border: #333333 (Dark Gray)
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Next.js and modern web technologies**
