# Tourist Management System

A comprehensive web-based system for travel agencies to manage tourists, track their location in real-time, handle bookings, and customize itineraries.

## Features

### User Management
- User registration and authentication
- Different user roles: Tourist, Travel Agent, Administrator

### Tourist Tracking
- Real-time location tracking of tourists
- Interactive map view with multiple layers
- Heat maps showing tourist concentration areas

### Booking Management
- Create and manage bookings
- Track booking status
- Itinerary customization

### Reporting and Analytics
- Tourist flow patterns
- Popular destinations
- Booking trends

## Technology Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- Leaflet.js for maps

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/Tourist-Management-System.git
```

2. Set up a web server (e.g., Apache, Nginx) to serve the files.

3. Navigate to the project root in your browser.

## Usage

### Login/Registration
- Access the system at `index.html`
- Register as a new user or login with existing credentials

### Dashboard
- View key statistics and metrics
- Access the main features from the sidebar navigation

### Tourist Management
- View and manage tourist information
- Add new tourists
- Track their current location

### Maps
- View tourists on the interactive map
- Toggle different map layers
- Use heat maps to visualize tourist concentration

### Bookings
- Create new bookings
- Manage existing bookings
- View and modify itineraries

## Project Structure

```
Tourist-Management-System/
├── css/                # CSS stylesheets
├── js/                 # JavaScript files
├── img/                # Images and icons
├── includes/           # Reusable HTML components
├── pages/              # Main application pages
│   ├── dashboard.html  # Main dashboard
│   ├── tourists/       # Tourist management
│   ├── bookings/       # Booking management
│   ├── maps/           # Interactive maps
│   └── reports/        # Reports and analytics
└── index.html          # Entry point (login/register)
```

## Demo Credentials

For testing purposes, you can use the following credentials:

- **Tourist**
  - Email: tourist@example.com
  - Password: password

- **Travel Agent**
  - Email: agent@example.com
  - Password: password

- **Administrator**
  - Email: admin@example.com
  - Password: password

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 