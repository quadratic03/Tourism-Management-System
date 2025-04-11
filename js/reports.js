/**
 * Tourist Management System
 * Reports Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mock data for demonstration - in a real application, this would come from the server
    const mockData = {
        touristStats: {
            monthly: [320, 380, 420, 450, 520, 610, 690, 720, 680, 590, 540, 480],
            total: 4862,
            active: 2547,
            avgRating: 4.7
        },
        bookingStats: {
            monthly: [180, 220, 250, 280, 320, 380, 410, 430, 400, 350, 320, 290],
            total: 2547,
            revenue: 128450,
            completed: 2314,
            cancelled: 129,
            pending: 104
        },
        revenueStats: {
            monthly: [8200, 9500, 11200, 12500, 14800, 16900, 18500, 19200, 17800, 15400, 13800, 12100],
            total: 128450,
            avgPerBooking: 49.5,
            topPackage: "Adventure Tours"
        },
        topDestinations: [
            { name: "Tokyo, Japan", tourists: 387, rating: 4.9, revenue: 24560 },
            { name: "Bali, Indonesia", tourists: 342, rating: 4.8, revenue: 21780 },
            { name: "Paris, France", tourists: 298, rating: 4.7, revenue: 19450 },
            { name: "Rome, Italy", tourists: 265, rating: 4.6, revenue: 17820 },
            { name: "New York, USA", tourists: 243, rating: 4.5, revenue: 15980 },
            { name: "London, UK", tourists: 230, rating: 4.6, revenue: 14780 },
            { name: "Barcelona, Spain", tourists: 210, rating: 4.7, revenue: 13240 }
        ],
        bookingSummary: [
            { type: "Adventure Tours", bookings: 876, completion: "98%", revenue: 43250 },
            { type: "Cultural Experiences", bookings: 654, completion: "95%", revenue: 32150 },
            { type: "Beach Vacations", bookings: 542, completion: "97%", revenue: 28760 },
            { type: "City Breaks", bookings: 321, completion: "92%", revenue: 15890 },
            { type: "Cruise Packages", bookings: 154, completion: "91%", revenue: 8400 }
        ]
    };

    // Initialize page based on selected report type
    function initializeReport(reportType = 'tourist') {
        const typeSelector = document.getElementById('reportType');
        if (typeSelector) {
            typeSelector.value = reportType;
        }
        
        updateSummaryStats(reportType);
        updateMainChart(reportType);
        updateDataTables(reportType);
    }

    // Update the summary statistics based on report type
    function updateSummaryStats(reportType) {
        const totalTourists = document.getElementById('totalTourists');
        const totalBookings = document.getElementById('totalBookings');
        const averageRating = document.getElementById('averageRating');
        const totalRevenue = document.getElementById('totalRevenue');

        switch(reportType) {
            case 'tourist':
                if (totalTourists) totalTourists.textContent = mockData.touristStats.total.toLocaleString();
                if (totalBookings) totalBookings.textContent = mockData.touristStats.active.toLocaleString();
                if (averageRating) averageRating.textContent = mockData.touristStats.avgRating.toFixed(1);
                break;
            case 'booking':
                if (totalBookings) totalBookings.textContent = mockData.bookingStats.total.toLocaleString();
                if (totalTourists) totalTourists.textContent = "—";
                if (averageRating) averageRating.textContent = `${Math.round((mockData.bookingStats.completed / mockData.bookingStats.total) * 100)}%`;
                break;
            case 'revenue':
                if (totalRevenue) totalRevenue.textContent = `$${mockData.revenueStats.total.toLocaleString()}`;
                if (totalBookings) totalBookings.textContent = mockData.bookingStats.total.toLocaleString();
                if (averageRating) averageRating.textContent = `$${mockData.revenueStats.avgPerBooking.toFixed(2)}`;
                break;
            case 'destination':
                if (totalTourists) totalTourists.textContent = mockData.touristStats.total.toLocaleString();
                if (averageRating) averageRating.textContent = mockData.touristStats.avgRating.toFixed(1);
                if (totalRevenue) totalRevenue.textContent = `$${mockData.revenueStats.total.toLocaleString()}`;
                break;
        }
        
        // Always show total revenue in the last card if not already shown
        if (totalRevenue && reportType !== 'revenue') {
            totalRevenue.textContent = `$${mockData.revenueStats.total.toLocaleString()}`;
        }
    }

    // Update main chart based on report type
    function updateMainChart(reportType) {
        // This function would be implemented to rebuild the chart with the correct data
        // The actual implementation is in the HTML file directly for the demo
        console.log('Chart would be updated for report type:', reportType);
    }

    // Update data tables based on report type
    function updateDataTables(reportType) {
        const destinationTableBody = document.getElementById('destinationTableBody');
        const bookingSummaryBody = document.getElementById('bookingSummaryBody');
        
        if (destinationTableBody) {
            // Clear existing rows
            destinationTableBody.innerHTML = '';
            
            // Add new rows from mockData
            mockData.topDestinations.forEach(destination => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${destination.name}</td>
                    <td>${destination.tourists}</td>
                    <td>${destination.rating}</td>
                    <td>$${destination.revenue.toLocaleString()}</td>
                `;
                destinationTableBody.appendChild(row);
            });
        }
        
        if (bookingSummaryBody) {
            // Clear existing rows
            bookingSummaryBody.innerHTML = '';
            
            // Add new rows from mockData
            mockData.bookingSummary.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.type}</td>
                    <td>${booking.bookings}</td>
                    <td>${booking.completion}</td>
                    <td>$${booking.revenue.toLocaleString()}</td>
                `;
                bookingSummaryBody.appendChild(row);
            });
        }
    }

    // Handle report filter form submission
    const reportFilterForm = document.getElementById('reportFilterForm');
    if (reportFilterForm) {
        reportFilterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reportType = document.getElementById('reportType').value;
            const dateRange = document.getElementById('dateRange').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            console.log('Generating report with filters:', {
                reportType,
                dateRange,
                startDate: dateRange === 'custom' ? startDate : null,
                endDate: dateRange === 'custom' ? endDate : null
            });
            
            // Update the UI based on selected report type
            initializeReport(reportType);
            
            // Show success message
            alert('Report generated successfully!');
        });
    }

    // Handle chart type changes
    const chartTypeButtons = document.querySelectorAll('[data-chart-type]');
    if (chartTypeButtons) {
        chartTypeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const chartType = this.getAttribute('data-chart-type');
                console.log('Changing chart type to:', chartType);
                // The actual implementation is in the HTML file for the demo
            });
        });
    }

    // Handle export buttons
    const exportButtons = document.querySelectorAll('[data-chart-export], #exportDestinations, #exportBookings');
    if (exportButtons) {
        exportButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const exportType = this.getAttribute('data-chart-export') || 'pdf';
                console.log('Exporting as:', exportType);
                alert(`Data would be exported as ${exportType.toUpperCase()} in a real application.`);
            });
        });
    }

    // Initialize report on page load
    initializeReport();
}); 