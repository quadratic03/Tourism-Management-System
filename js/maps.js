document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('tms_user')) || JSON.parse(sessionStorage.getItem('tms_user'));
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = '../../index.html';
        return;
    }

    // Initialize map if on the maps page
    const fullMapElement = document.getElementById('fullMap');
    if (fullMapElement) {
        initializeFullMap();
    }
    
    // Initialize map sidebar toggle
    initializeMapSidebar();
});

function initializeFullMap() {
    // Create map centered on a default location (e.g., center of the US)
    const map = L.map('fullMap').setView([37.0902, -95.7129], 4);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
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
        { id: 5, name: "Liberty Lodge", location: [39.9500, -75.1700], rating: 4 }, // Philadelphia
        { id: 6, name: "Desert Oasis", location: [33.4500, -112.0700], rating: 5 }, // Phoenix
        { id: 7, name: "Ocean View Inn", location: [32.7200, -117.1650], rating: 4 }, // San Diego
        { id: 8, name: "Bay Area Hotel", location: [37.7800, -122.4150], rating: 5 }  // San Francisco
    ];
    
    // Sample data for attractions
    const attractions = [
        { id: 1, name: "Statue of Liberty", location: [40.6892, -74.0445], type: "monument" }, // New York
        { id: 2, name: "Hollywood Sign", location: [34.1341, -118.3215], type: "landmark" }, // Los Angeles
        { id: 3, name: "Cloud Gate", location: [41.8827, -87.6233], type: "art" }, // Chicago
        { id: 4, name: "Space Center", location: [29.5530, -95.0930], type: "museum" }, // Houston
        { id: 5, name: "Liberty Bell", location: [39.9496, -75.1503], type: "historic" }, // Philadelphia
        { id: 6, name: "Desert Botanical Garden", location: [33.4614, -111.9439], type: "nature" }, // Phoenix
        { id: 7, name: "Balboa Park", location: [32.7340, -117.1440], type: "park" }, // San Diego
        { id: 8, name: "Golden Gate Bridge", location: [37.8199, -122.4783], type: "landmark" }  // San Francisco
    ];
    
    // Sample data for emergency points
    const emergencyPoints = [
        { id: 1, name: "City Hospital", location: [40.7680, -73.9655], type: "hospital" }, // New York
        { id: 2, name: "Central Police Station", location: [34.0725, -118.2437], type: "police" }, // Los Angeles
        { id: 3, name: "Emergency Medical Center", location: [41.8700, -87.6298], type: "hospital" }, // Chicago
        { id: 4, name: "Safety Point Alpha", location: [29.7504, -95.3698], type: "shelter" }  // Houston
    ];
    
    // Create layer groups
    const touristLayer = L.layerGroup();
    const hotelLayer = L.layerGroup();
    const attractionLayer = L.layerGroup();
    const emergencyLayer = L.layerGroup();
    
    // Tourist markers with different icons for active and inactive
    tourists.forEach(tourist => {
        const markerColor = tourist.status === 'active' ? 'green' : 'gray';
        const touristIcon = L.divIcon({
            html: `<i class="fas fa-user" style="color: ${markerColor}; font-size: 20px;"></i>`,
            className: 'tourist-marker-icon',
            iconSize: [30, 30]
        });
        
        const marker = L.marker(tourist.location, { icon: touristIcon })
            .bindPopup(`
                <div class="tourist-popup">
                    <h6>${tourist.name}</h6>
                    <p>Status: <span class="badge ${tourist.status === 'active' ? 'bg-success' : 'bg-secondary'}">${tourist.status}</span></p>
                    <button class="btn btn-sm btn-primary view-tourist-btn" data-id="${tourist.id}">View Profile</button>
                    <button class="btn btn-sm btn-outline-primary track-tourist-btn" data-id="${tourist.id}">Track Movement</button>
                </div>
            `);
        
        // Store the tourist ID with the marker for reference
        marker._touristId = tourist.id;
        touristLayer.addLayer(marker);
    });
    
    // Hotel markers
    hotels.forEach(hotel => {
        const hotelIcon = L.divIcon({
            html: `<i class="fas fa-hotel" style="color: #0066cc; font-size: 20px;"></i>`,
            className: 'hotel-marker-icon',
            iconSize: [30, 30]
        });
        
        const marker = L.marker(hotel.location, { icon: hotelIcon })
            .bindPopup(`
                <div class="hotel-popup">
                    <h6>${hotel.name}</h6>
                    <p>Rating: ${'★'.repeat(hotel.rating) + '☆'.repeat(5-hotel.rating)}</p>
                    <button class="btn btn-sm btn-outline-primary">View Details</button>
                </div>
            `);
        
        hotelLayer.addLayer(marker);
    });
    
    // Attraction markers
    attractions.forEach(attraction => {
        const attractionIcon = L.divIcon({
            html: `<i class="fas fa-camera" style="color: #cc00cc; font-size: 20px;"></i>`,
            className: 'attraction-marker-icon',
            iconSize: [30, 30]
        });
        
        const marker = L.marker(attraction.location, { icon: attractionIcon })
            .bindPopup(`
                <div class="attraction-popup">
                    <h6>${attraction.name}</h6>
                    <p>Type: ${attraction.type}</p>
                    <button class="btn btn-sm btn-outline-primary">View Details</button>
                </div>
            `);
        
        attractionLayer.addLayer(marker);
    });
    
    // Emergency point markers
    emergencyPoints.forEach(point => {
        let iconClass = 'fas fa-first-aid';
        if (point.type === 'police') iconClass = 'fas fa-shield-alt';
        else if (point.type === 'shelter') iconClass = 'fas fa-home';
        
        const emergencyIcon = L.divIcon({
            html: `<i class="${iconClass}" style="color: red; font-size: 20px;"></i>`,
            className: 'emergency-marker-icon',
            iconSize: [30, 30]
        });
        
        const marker = L.marker(point.location, { icon: emergencyIcon })
            .bindPopup(`
                <div class="emergency-popup">
                    <h6>${point.name}</h6>
                    <p>Type: ${point.type}</p>
                    <button class="btn btn-sm btn-danger">Contact</button>
                </div>
            `);
        
        emergencyLayer.addLayer(marker);
    });
    
    // Add layers to map
    touristLayer.addTo(map);
    hotelLayer.addTo(map);
    attractionLayer.addTo(map);
    // Emergency layer not added by default
    
    // Set up layer controls
    const touristLayerCheckbox = document.getElementById('touristLayer');
    const hotelLayerCheckbox = document.getElementById('hotelLayer');
    const attractionLayerCheckbox = document.getElementById('attractionLayer');
    const emergencyLayerCheckbox = document.getElementById('emergencyLayer');
    
    if (touristLayerCheckbox) {
        touristLayerCheckbox.addEventListener('change', function() {
            toggleMapLayer(map, touristLayer, this.checked);
        });
    }
    
    if (hotelLayerCheckbox) {
        hotelLayerCheckbox.addEventListener('change', function() {
            toggleMapLayer(map, hotelLayer, this.checked);
        });
    }
    
    if (attractionLayerCheckbox) {
        attractionLayerCheckbox.addEventListener('change', function() {
            toggleMapLayer(map, attractionLayer, this.checked);
        });
    }
    
    if (emergencyLayerCheckbox) {
        emergencyLayerCheckbox.addEventListener('change', function() {
            toggleMapLayer(map, emergencyLayer, this.checked);
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
    
    // Heat map toggle
    const heatMapToggle = document.getElementById('heatMapToggle');
    let heatMapActive = false;
    let heatLayer = null;
    
    if (heatMapToggle) {
        heatMapToggle.addEventListener('click', function() {
            heatMapActive = !heatMapActive;
            toggleHeatMap(map, tourists, heatMapActive, heatLayer, heatMapToggle);
        });
    }
    
    // Cluster toggle (simulated)
    const clusterToggle = document.getElementById('clusterToggle');
    let clusterActive = false;
    
    if (clusterToggle) {
        clusterToggle.addEventListener('click', function() {
            clusterActive = !clusterActive;
            
            if (clusterActive) {
                // In a real app, we would use a proper clustering library like MarkerCluster
                // For this demo, we'll just change the button style to indicate it's active
                clusterToggle.classList.add('active');
                clusterToggle.style.backgroundColor = '#ff7700';
                clusterToggle.style.color = '#fff';
                
                // Show a message that clustering is enabled (for demo purposes)
                const customAlert = L.control({position: 'topright'});
                customAlert.onAdd = function() {
                    const div = L.DomUtil.create('div', 'alert alert-info');
                    div.innerHTML = '<strong>Clustering Enabled!</strong> In a real application, nearby markers would be clustered together.';
                    div.style.padding = '10px';
                    div.style.margin = '10px';
                    div.style.backgroundColor = 'white';
                    div.style.border = '1px solid #ccc';
                    div.style.borderRadius = '5px';
                    setTimeout(() => div.remove(), 3000);
                    return div;
                };
                customAlert.addTo(map);
            } else {
                clusterToggle.classList.remove('active');
                clusterToggle.style.backgroundColor = '';
                clusterToggle.style.color = '';
            }
        });
    }
    
    // Full screen toggle
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    if (fullScreenBtn) {
        fullScreenBtn.addEventListener('click', function() {
            const mapContainer = document.querySelector('.full-map-container');
            if (mapContainer) {
                if (!document.fullscreenElement) {
                    mapContainer.requestFullscreen().catch(err => {
                        alert(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
        });
    }
    
    // Handle map resize when going fullscreen
    document.addEventListener('fullscreenchange', function() {
        map.invalidateSize();
    });
    
    // Setup tourist list interactivity
    setupTouristList(map, tourists);
    
    // Setup refresh button
    const refreshMapBtn = document.getElementById('refreshMapBtn');
    if (refreshMapBtn) {
        refreshMapBtn.addEventListener('click', function() {
            // In a real app, this would fetch fresh data
            // For demo, we'll just show a spinner and then update the interface
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Refresh';
                this.disabled = false;
                
                // Show a success message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                alertDiv.innerHTML = 'Map data refreshed successfully!';
                document.body.appendChild(alertDiv);
                
                setTimeout(() => alertDiv.remove(), 3000);
            }, 1500);
        });
    }
}

function toggleMapLayer(map, layer, isVisible) {
    if (isVisible) {
        map.addLayer(layer);
    } else {
        map.removeLayer(layer);
    }
}

function toggleHeatMap(map, tourists, isActive, heatLayer, button) {
    if (isActive) {
        // In a real app, we would use a proper heat map library like Leaflet.heat
        // For this demo, we're simulating with circles
        heatLayer = L.layerGroup();
        
        const heatData = tourists.map(t => {
            return {
                lat: t.location[0],
                lng: t.location[1],
                intensity: t.status === 'active' ? 0.7 : 0.3
            };
        });
        
        heatData.forEach(point => {
            const circle = L.circle([point.lat, point.lng], {
                radius: 20000,
                color: 'rgba(255, 0, 0, 0)',
                fillColor: '#ff0000',
                fillOpacity: point.intensity * 0.5
            });
            
            heatLayer.addLayer(circle);
        });
        
        heatLayer.addTo(map);
        button.classList.add('active');
        button.style.backgroundColor = '#ff7700';
        button.style.color = '#fff';
    } else {
        if (heatLayer) {
            map.removeLayer(heatLayer);
            button.classList.remove('active');
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    }
    
    return heatLayer;
}

function initializeMapSidebar() {
    const sidebarMapToggle = document.getElementById('sidebarMapToggle');
    const sidebarMapClose = document.getElementById('sidebarMapClose');
    const mapSidebar = document.getElementById('mapSidebar');
    
    if (sidebarMapToggle && mapSidebar) {
        sidebarMapToggle.addEventListener('click', function() {
            mapSidebar.classList.add('open');
        });
    }
    
    if (sidebarMapClose && mapSidebar) {
        sidebarMapClose.addEventListener('click', function() {
            mapSidebar.classList.remove('open');
        });
    }
    
    // Setup tourist search in sidebar
    const mapTouristSearch = document.getElementById('mapTouristSearch');
    if (mapTouristSearch) {
        mapTouristSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const touristItems = document.querySelectorAll('.tourist-item');
            
            touristItems.forEach(item => {
                const touristName = item.querySelector('h6').textContent.toLowerCase();
                const touristLocation = item.querySelector('small').textContent.toLowerCase();
                
                if (touristName.includes(searchTerm) || touristLocation.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function setupTouristList(map, tourists) {
    const touristItems = document.querySelectorAll('.tourist-item');
    
    touristItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            touristItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get tourist ID
            const touristId = parseInt(this.getAttribute('data-id'));
            
            // Find the corresponding tourist data
            const tourist = tourists.find(t => t.id === touristId);
            
            if (tourist) {
                // Center map on tourist
                map.setView(tourist.location, 12);
                
                // Find and open the marker popup
                map.eachLayer(layer => {
                    if (layer._touristId === touristId) {
                        layer.openPopup();
                    }
                });
            }
        });
    });
} 