document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('tms_user')) || JSON.parse(sessionStorage.getItem('tms_user'));
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = '../index.html';
        return;
    }

    // Update user info in header
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    if (userName && userRole) {
        userName.textContent = userData.name;
        userRole.textContent = userData.role;
    }

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('content-collapsed');
            
            // Store preference in localStorage
            const isSidebarCollapsed = sidebar.classList.contains('sidebar-collapsed');
            localStorage.setItem('tms_sidebar_collapsed', isSidebarCollapsed);
        });
        
        // Apply saved sidebar state
        const isSidebarCollapsed = localStorage.getItem('tms_sidebar_collapsed') === 'true';
        if (isSidebarCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('content-collapsed');
        }
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from storage
            localStorage.removeItem('tms_user');
            sessionStorage.removeItem('tms_user');
            
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }
    
    // Initialize map if the element exists
    const mapContainer = document.getElementById('touristMap');
    if (mapContainer) {
        // Ensure Leaflet is loaded before initializing the map
        if (typeof L !== 'undefined') {
            console.log('Leaflet is loaded, initializing map directly...');
            initializeMap();
        } else {
            console.log('Leaflet not loaded yet, waiting...');
            // Set a timeout to give Leaflet time to load
            setTimeout(() => {
                if (typeof L !== 'undefined') {
                    console.log('Leaflet loaded after delay, initializing map...');
                    initializeMap();
                } else {
                    console.error('Leaflet failed to load after delay');
                    // Show a message to the user about the map loading failure
                    mapContainer.innerHTML = `
                        <div class="alert alert-warning m-3">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Map could not be loaded. Please refresh the page.
                        </div>
                    `;
                }
            }, 1000);
        }
    }
    
    // Initialize any charts or additional components
    initializeCharts();
});

function initializeMap() {
    console.log('Initializing map...');
    
    try {
        // Create map centered on a default location (e.g., center of the country)
        const map = L.map('touristMap', {
            zoomControl: false // Disable default zoom controls to use custom ones
        }).setView([37.0902, -95.7129], 4); // Default to US center
        
        console.log('Map object created');
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        console.log('Tile layer added');

        // Fix map rendering issues by triggering resize after a delay
        setTimeout(() => {
            console.log('Invalidating map size...');
            map.invalidateSize(true);
        }, 500);
        
        // Sample data for tourists (in a real app, this would come from an API)
        const tourists = [
            { id: 1, name: "John Smith", location: [40.7128, -74.0060], status: "active" }, // New York
            { id: 2, name: "Alice Johnson", location: [34.0522, -118.2437], status: "active" }, // Los Angeles
            { id: 3, name: "Robert Chen", location: [41.8781, -87.6298], status: "inactive" }, // Chicago
            { id: 4, name: "Maria Garcia", location: [29.7604, -95.3698], status: "active" }, // Houston
            { id: 5, name: "David Wilson", location: [39.9526, -75.1652], status: "active" }, // Philadelphia
            { id: 6, name: "Sarah Thompson", location: [33.4484, -112.0740], status: "active" }, // Phoenix
            { id: 7, name: "James Brown", location: [32.7157, -117.1611], status: "inactive" }, // San Diego
            { id: 8, name: "Jennifer Davis", location: [37.7749, -122.4194], status: "active" } // San Francisco
        ];
        
        // Sample data for hotels
        const hotels = [
            { id: 1, name: "Grand Hotel", location: [40.7580, -73.9855], rating: 5 }, // New York
            { id: 2, name: "Sunset Resort", location: [34.0825, -118.4104], rating: 4 }, // Los Angeles
            { id: 3, name: "Windy City Inn", location: [41.8901, -87.6305], rating: 3 }, // Chicago
            { id: 4, name: "Gulf View Hotel", location: [29.7230, -95.4189], rating: 4 }, // Houston
        ];
        
        // Sample data for attractions
        const attractions = [
            { id: 1, name: "Statue of Liberty", location: [40.6892, -74.0445], type: "monument" }, // New York
            { id: 2, name: "Hollywood Sign", location: [34.1341, -118.3215], type: "landmark" }, // Los Angeles
            { id: 3, name: "Cloud Gate", location: [41.8827, -87.6233], type: "art" }, // Chicago
            { id: 4, name: "Space Center", location: [29.5530, -95.0930], type: "museum" }, // Houston
        ];
        
        // Create layer groups
        const touristLayer = L.layerGroup();
        const hotelLayer = L.layerGroup();
        const attractionLayer = L.layerGroup();
        
        // Tourist markers with proper styling
        tourists.forEach(tourist => {
            const markerColor = tourist.status === 'active' ? 'green' : 'gray';
            const touristIcon = L.divIcon({
                html: `<div style="font-size: 20px; color: ${markerColor};"><i class="fas fa-user"></i></div>`,
                className: 'tourist-marker-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker(tourist.location, { icon: touristIcon })
                .bindPopup(`
                    <div class="tourist-popup">
                        <h6>${tourist.name}</h6>
                        <p>Status: <span class="badge ${tourist.status === 'active' ? 'bg-success' : 'bg-secondary'}">${tourist.status}</span></p>
                        <button class="btn btn-sm btn-primary">View Profile</button>
                    </div>
                `);
            
            touristLayer.addLayer(marker);
        });
        
        // Hotel markers with proper styling
        hotels.forEach(hotel => {
            const hotelIcon = L.divIcon({
                html: `<div style="font-size: 20px; color: #0066cc;"><i class="fas fa-hotel"></i></div>`,
                className: 'hotel-marker-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker(hotel.location, { icon: hotelIcon })
                .bindPopup(`
                    <div class="hotel-popup">
                        <h6>${hotel.name}</h6>
                        <p>Rating: ${'★'.repeat(hotel.rating) + '☆'.repeat(5-hotel.rating)}</p>
                    </div>
                `);
            
            hotelLayer.addLayer(marker);
        });
        
        // Attraction markers with proper styling
        attractions.forEach(attraction => {
            const attractionIcon = L.divIcon({
                html: `<div style="font-size: 20px; color: #cc00cc;"><i class="fas fa-camera"></i></div>`,
                className: 'attraction-marker-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker(attraction.location, { icon: attractionIcon })
                .bindPopup(`
                    <div class="attraction-popup">
                        <h6>${attraction.name}</h6>
                        <p>Type: ${attraction.type}</p>
                    </div>
                `);
            
            attractionLayer.addLayer(marker);
        });
        
        // Add layers to map
        touristLayer.addTo(map);
        hotelLayer.addTo(map);
        attractionLayer.addTo(map);
        
        // Set up layer controls
        const touristLayerCheckbox = document.getElementById('touristLayer');
        const hotelLayerCheckbox = document.getElementById('hotelLayer');
        const attractionLayerCheckbox = document.getElementById('attractionLayer');
        
        if (touristLayerCheckbox) {
            touristLayerCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    map.addLayer(touristLayer);
                } else {
                    map.removeLayer(touristLayer);
                }
            });
        }
        
        if (hotelLayerCheckbox) {
            hotelLayerCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    map.addLayer(hotelLayer);
                } else {
                    map.removeLayer(hotelLayer);
                }
            });
        }
        
        if (attractionLayerCheckbox) {
            attractionLayerCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    map.addLayer(attractionLayer);
                } else {
                    map.removeLayer(attractionLayer);
                }
            });
        }
        
        // Set up zoom controls
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', function() {
                map.zoomIn();
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', function() {
                map.zoomOut();
            });
        }
        
        // Heat map toggle (simulated)
        const heatMapToggle = document.getElementById('heatMapToggle');
        let heatMapActive = false;
        let heatLayer = null;
        
        if (heatMapToggle) {
            heatMapToggle.addEventListener('click', function() {
                heatMapActive = !heatMapActive;
                
                if (heatMapActive) {
                    // In a real app, this would use a proper heat map library like Leaflet.heat
                    // We're simulating it with a simple circle overlay
                    const heatData = tourists.map(t => {
                        return {
                            lat: t.location[0],
                            lng: t.location[1],
                            intensity: 0.5
                        };
                    });
                    
                    heatLayer = L.layerGroup();
                    
                    heatData.forEach(point => {
                        const circle = L.circle([point.lat, point.lng], {
                            radius: 15000,
                            color: 'rgba(255, 0, 0, 0)',
                            fillColor: '#ff0000',
                            fillOpacity: point.intensity * 0.5
                        });
                        
                        heatLayer.addLayer(circle);
                    });
                    
                    heatLayer.addTo(map);
                    heatMapToggle.classList.add('active');
                    heatMapToggle.style.backgroundColor = '#ff7700';
                    heatMapToggle.style.color = '#fff';
                } else {
                    if (heatLayer) {
                        map.removeLayer(heatLayer);
                        heatMapToggle.classList.remove('active');
                        heatMapToggle.style.backgroundColor = '';
                        heatMapToggle.style.color = '';
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

function initializeCharts() {
    // This would implement charts for dashboard stats
    // Using a library like Chart.js or D3.js
    // For this demo, we'll leave it empty
} 