document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('tms_user')) || JSON.parse(sessionStorage.getItem('tms_user'));
    if (!userData) {
        // Redirect to login page if not logged in
        window.location.href = '../../index.html';
        return;
    }

    // Initialize booking list events
    initializeBookingList();
    
    // Setup search functionality
    setupSearch();
    
    // Setup add booking form submission
    setupAddBookingForm();
});

function initializeBookingList() {
    const bookingItems = document.querySelectorAll('.booking-list .list-group-item');
    
    bookingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            bookingItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get booking ID
            const bookingId = this.getAttribute('data-booking-id');
            
            // In a real app, you would fetch booking details from a server
            // For this demo, we already have the details loaded in the page
            // So we'll just update the UI to show the selected booking
            
            // This would typically update the booking details section based on the selected booking
            // For demo purposes, we'll just show a message
            console.log(`Booking ${bookingId} selected`);
            
            // In a real app, you would update the booking details section with the selected booking's data
            updateBookingDetails(bookingId);
        });
    });
}

function updateBookingDetails(bookingId) {
    // This function would fetch booking details from the server and update the UI
    // For demo purposes, we'll just simulate different bookings
    
    const bookingDetailsSection = document.querySelector('.booking-details');
    
    // Sample data for different bookings
    const bookings = {
        'BK001': {
            title: 'Tokyo Adventure',
            status: 'Confirmed',
            statusClass: 'success',
            customer: 'John Smith',
            email: 'john.smith@example.com',
            bookingDate: 'June 5, 2023',
            tripDates: 'Jun 12, 2023 - Jun 20, 2023',
            duration: '9 days',
            destination: 'Tokyo, Japan',
            tourists: '2 Adults, 1 Child',
            accommodation: 'Grand Hotel Tokyo',
            accommodationDetails: 'Deluxe Room, Breakfast Included',
            transportation: 'Round-trip Flight',
            transportationDetails: 'Airport Transfer Included',
            payment: 'Paid in Full',
            transactionId: 'TRX-95874236',
            amount: '$2,850'
        },
        'BK002': {
            title: 'Paris Experience',
            status: 'Pending',
            statusClass: 'warning',
            customer: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            bookingDate: 'June 7, 2023',
            tripDates: 'Jun 15, 2023 - Jun 22, 2023',
            duration: '8 days',
            destination: 'Paris, France',
            tourists: '2 Adults',
            accommodation: 'Paris Luxury Hotel',
            accommodationDetails: 'Superior Room, All Inclusive',
            transportation: 'Round-trip Flight',
            transportationDetails: 'Airport Transfer Included',
            payment: 'Partially Paid',
            transactionId: 'TRX-78452136',
            amount: '$3,200'
        },
        'BK003': {
            title: 'Barcelona Tour',
            status: 'Cancelled',
            statusClass: 'danger',
            customer: 'Robert Chen',
            email: 'robert.chen@example.com',
            bookingDate: 'June 3, 2023',
            tripDates: 'Jun 10, 2023 - Jun 17, 2023',
            duration: '8 days',
            destination: 'Barcelona, Spain',
            tourists: '1 Adult',
            accommodation: 'Barcelona Beach Resort',
            accommodationDetails: 'Standard Room, Breakfast Included',
            transportation: 'Round-trip Flight',
            transportationDetails: 'No Airport Transfer',
            payment: 'Refunded',
            transactionId: 'TRX-36521478',
            amount: '$1,950'
        },
        'BK004': {
            title: 'Rome Adventure',
            status: 'Confirmed',
            statusClass: 'success',
            customer: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            bookingDate: 'June 10, 2023',
            tripDates: 'Jun 20, 2023 - Jun 27, 2023',
            duration: '8 days',
            destination: 'Rome, Italy',
            tourists: '2 Adults, 2 Children',
            accommodation: 'Roman Heritage Hotel',
            accommodationDetails: 'Family Suite, Half Board',
            transportation: 'Round-trip Flight',
            transportationDetails: 'Airport Transfer Included',
            payment: 'Paid in Full',
            transactionId: 'TRX-95123654',
            amount: '$3,400'
        },
        'BK005': {
            title: 'New York City Tour',
            status: 'Confirmed',
            statusClass: 'success',
            customer: 'David Wilson',
            email: 'david.wilson@example.com',
            bookingDate: 'June 12, 2023',
            tripDates: 'Jun 25, 2023 - Jul 02, 2023',
            duration: '8 days',
            destination: 'New York, USA',
            tourists: '2 Adults',
            accommodation: 'Manhattan Deluxe Hotel',
            accommodationDetails: 'Premium Room, Room Only',
            transportation: 'Round-trip Flight',
            transportationDetails: 'Airport Transfer Included',
            payment: 'Paid in Full',
            transactionId: 'TRX-78563214',
            amount: '$3,150'
        }
    };
    
    // Get the selected booking data
    const booking = bookings[bookingId];
    
    if (!booking) {
        console.error(`Booking ${bookingId} not found`);
        return;
    }
    
    // Update the booking details in the UI
    if (bookingDetailsSection) {
        // Update booking title and status
        const titleElement = bookingDetailsSection.querySelector('h4');
        const statusBadge = bookingDetailsSection.querySelector('.badge');
        
        if (titleElement) titleElement.textContent = booking.title;
        if (statusBadge) {
            statusBadge.textContent = booking.status;
            statusBadge.className = `badge bg-${booking.statusClass} px-3 py-2`;
        }
        
        // Update booking ID
        const bookingIdElement = bookingDetailsSection.querySelector('.row:nth-child(2) .col-md-6:nth-child(1) .fw-bold');
        if (bookingIdElement) bookingIdElement.textContent = `#${bookingId}`;
        
        // Update booking date
        const bookingDateElement = bookingDetailsSection.querySelector('.row:nth-child(2) .col-md-6:nth-child(2) .fw-bold');
        if (bookingDateElement) bookingDateElement.textContent = booking.bookingDate;
        
        // Update customer info
        const customerNameElement = bookingDetailsSection.querySelector('.row:nth-child(3) .col-md-6:nth-child(1) .fw-bold');
        const customerEmailElement = bookingDetailsSection.querySelector('.row:nth-child(3) .col-md-6:nth-child(1) small');
        if (customerNameElement) customerNameElement.textContent = booking.customer;
        if (customerEmailElement) customerEmailElement.textContent = booking.email;
        
        // Update trip period
        const tripPeriodElement = bookingDetailsSection.querySelector('.row:nth-child(3) .col-md-6:nth-child(2) .fw-bold');
        const tripDurationElement = bookingDetailsSection.querySelector('.row:nth-child(3) .col-md-6:nth-child(2) small');
        if (tripPeriodElement) tripPeriodElement.textContent = booking.tripDates;
        if (tripDurationElement) tripDurationElement.textContent = booking.duration;
        
        // Update destination and tourists
        const destinationElement = bookingDetailsSection.querySelector('.row:nth-child(4) .col-md-6:nth-child(1) .fw-bold');
        const touristsElement = bookingDetailsSection.querySelector('.row:nth-child(4) .col-md-6:nth-child(2) .fw-bold');
        if (destinationElement) destinationElement.textContent = booking.destination;
        if (touristsElement) touristsElement.textContent = booking.tourists;
        
        // Update accommodation and transportation
        const accommodationElement = bookingDetailsSection.querySelector('.row:nth-child(5) .col-md-6:nth-child(1) .fw-bold');
        const accommodationDetailsElement = bookingDetailsSection.querySelector('.row:nth-child(5) .col-md-6:nth-child(1) small');
        const transportationElement = bookingDetailsSection.querySelector('.row:nth-child(5) .col-md-6:nth-child(2) .fw-bold');
        const transportationDetailsElement = bookingDetailsSection.querySelector('.row:nth-child(5) .col-md-6:nth-child(2) small');
        
        if (accommodationElement) accommodationElement.textContent = booking.accommodation;
        if (accommodationDetailsElement) accommodationDetailsElement.textContent = booking.accommodationDetails;
        if (transportationElement) transportationElement.textContent = booking.transportation;
        if (transportationDetailsElement) transportationDetailsElement.textContent = booking.transportationDetails;
        
        // Update payment info
        const paymentStatusElement = bookingDetailsSection.querySelector('.row:last-child .col-md-6:nth-child(1) .fw-bold');
        const transactionIdElement = bookingDetailsSection.querySelector('.row:last-child .col-md-6:nth-child(1) small');
        const amountElement = bookingDetailsSection.querySelector('.row:last-child .col-md-6:nth-child(2) .fw-bold');
        
        if (paymentStatusElement) {
            paymentStatusElement.textContent = booking.payment;
            paymentStatusElement.className = `fw-bold text-${booking.statusClass}`;
        }
        if (transactionIdElement) transactionIdElement.textContent = `Transaction ID: ${booking.transactionId}`;
        if (amountElement) amountElement.textContent = booking.amount;
    }
}

function setupSearch() {
    const searchInput = document.getElementById('bookingSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const bookingItems = document.querySelectorAll('.booking-list .list-group-item');
            
            bookingItems.forEach(item => {
                const bookingTitle = item.querySelector('h6').textContent.toLowerCase();
                const customerName = item.querySelector('p').textContent.toLowerCase();
                const bookingDate = item.querySelector('p.mb-1').textContent.toLowerCase();
                
                // Check if any of the fields contain the search term
                const matchesSearch = bookingTitle.includes(searchTerm) || 
                                     customerName.includes(searchTerm) || 
                                     bookingDate.includes(searchTerm);
                
                // Show or hide the item based on the search result
                item.style.display = matchesSearch ? '' : 'none';
            });
        });
    }
}

function setupAddBookingForm() {
    const saveBookingBtn = document.getElementById('saveBookingBtn');
    const addBookingForm = document.getElementById('addBookingForm');
    
    if (saveBookingBtn && addBookingForm) {
        saveBookingBtn.addEventListener('click', function() {
            // Check form validity
            const isValid = validateBookingForm(addBookingForm);
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For demo purposes, we'll just show a success message and refresh the page
                
                alert('Booking created successfully!');
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addBookingModal'));
                modal.hide();
                
                // Reset the form
                addBookingForm.reset();
                
                // In a real application, you would dynamically add the new booking to the list
                // For demo purposes, we'll just reload the page after a short delay
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        });
    }
}

function validateBookingForm(form) {
    // Get form fields
    const bookingTitle = document.getElementById('bookingTitle').value;
    const customer = document.getElementById('customerSelect').value;
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const adults = document.getElementById('adults').value;
    const accommodation = document.getElementById('accommodation').value;
    const transportation = document.getElementById('transportation').value;
    
    // Check required fields
    if (!bookingTitle || !customer || !destination || !startDate || !endDate || 
        !adults || !accommodation || !transportation) {
        alert('Please fill in all required fields');
        return false;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
        alert('End date must be after start date');
        return false;
    }
    
    return true;
} 