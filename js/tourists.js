document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('tms_user')) || JSON.parse(sessionStorage.getItem('tms_user'));
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = '../../index.html';
        return;
    }

    // Initialize tourist data
    initializeTouristData();
    
    // Setup search functionality
    setupSearch();
    
    // Setup add tourist form submission
    setupAddTouristForm();
});

function initializeTouristData() {
    // In a real application, this would fetch data from a server
    // For demo purposes, we're using static data
    
    // Sample tourist data is already in the HTML
    // This function would typically load data dynamically
    
    // Setup event listeners for tourist cards
    setupTouristCardEvents();
}

function setupTouristCardEvents() {
    // View tourist details
    const viewButtons = document.querySelectorAll('.tourist-action i.fa-eye');
    viewButtons.forEach(button => {
        button.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const touristCard = this.closest('.tourist-card');
            const touristName = touristCard.querySelector('.tourist-name').textContent;
            alert(`Viewing details for ${touristName} - In a real app, this would open a detailed view`);
        });
    });
    
    // Edit tourist details
    const editButtons = document.querySelectorAll('.tourist-action i.fa-edit');
    editButtons.forEach(button => {
        button.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const touristCard = this.closest('.tourist-card');
            const touristName = touristCard.querySelector('.tourist-name').textContent;
            alert(`Editing details for ${touristName} - In a real app, this would open an edit form`);
        });
    });
    
    // Track tourist location
    const trackButtons = document.querySelectorAll('.tourist-action i.fa-map');
    trackButtons.forEach(button => {
        button.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const touristCard = this.closest('.tourist-card');
            const touristName = touristCard.querySelector('.tourist-name').textContent;
            const touristLocation = touristCard.querySelector('.tourist-location span').textContent;
            alert(`Tracking location for ${touristName} at ${touristLocation} - In a real app, this would open a map view`);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('touristSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const touristCards = document.querySelectorAll('.tourist-card');
            
            touristCards.forEach(card => {
                const touristName = card.querySelector('.tourist-name').textContent.toLowerCase();
                const touristLocation = card.querySelector('.tourist-location span').textContent.toLowerCase();
                const touristPassport = card.querySelector('.detail-item:nth-child(1) .detail-value').textContent.toLowerCase();
                const touristNationality = card.querySelector('.detail-item:nth-child(2) .detail-value').textContent.toLowerCase();
                
                // Check if any of the fields contain the search term
                const matchesSearch = touristName.includes(searchTerm) || 
                                     touristLocation.includes(searchTerm) || 
                                     touristPassport.includes(searchTerm) || 
                                     touristNationality.includes(searchTerm);
                
                // Show or hide the card based on the search result
                card.style.display = matchesSearch ? 'block' : 'none';
            });
        });
    }
}

function setupAddTouristForm() {
    const saveTouristBtn = document.getElementById('saveTouristBtn');
    const addTouristForm = document.getElementById('addTouristForm');
    
    if (saveTouristBtn && addTouristForm) {
        saveTouristBtn.addEventListener('click', function() {
            // Check form validity
            const isValid = validateTouristForm(addTouristForm);
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For demo purposes, we'll just show a success message and refresh the page
                
                alert('Tourist added successfully!');
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addTouristModal'));
                modal.hide();
                
                // Reset the form
                addTouristForm.reset();
                
                // In a real application, you would dynamically add the new tourist to the list
                // For demo purposes, we'll just reload the page after a short delay
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        });
    }
}

function validateTouristForm(form) {
    // Get form fields
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const nationality = document.getElementById('nationality').value;
    const passport = document.getElementById('passport').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;
    const emergencyContact = document.getElementById('emergencyContact').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const address = document.getElementById('address').value;
    const trackingConsent = document.getElementById('trackingConsent').checked;
    
    // Check required fields
    if (!fullName || !email || !nationality || !passport || !dateOfBirth || !gender || 
        !phone || !emergencyContact || !startDate || !endDate || !address || !trackingConsent) {
        alert('Please fill in all required fields and confirm tracking consent');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
        alert('End date must be after start date');
        return false;
    }
    
    // Validate passport number format (simple example)
    const passportRegex = /^[A-Z0-9]{6,9}$/;
    if (!passportRegex.test(passport)) {
        alert('Please enter a valid passport number (6-9 alphanumeric characters)');
        return false;
    }
    
    return true;
} 