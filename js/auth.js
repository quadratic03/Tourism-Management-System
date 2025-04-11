document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (!email || !password) {
                showAlert('Please enter both email and password', 'danger');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just simulate a successful login
            
            // Store user info in localStorage or sessionStorage based on "Remember me" choice
            const userData = {
                email: email,
                name: 'Demo User',
                role: 'Travel Agent'
            };
            
            if (rememberMe) {
                localStorage.setItem('tms_user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('tms_user', JSON.stringify(userData));
            }
            
            // Redirect to dashboard
            window.location.href = 'pages/dashboard.html';
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.getElementById('userType').value;
            const termsAgreement = document.getElementById('termsAgreement').checked;
            
            // Simple validation
            if (!fullName || !email || !password || !confirmPassword || !userType) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            if (!termsAgreement) {
                showAlert('You must agree to the Terms and Conditions', 'danger');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just simulate a successful registration
            
            // Store user info
            const userData = {
                name: fullName,
                email: email,
                role: userType
            };
            
            localStorage.setItem('tms_user', JSON.stringify(userData));
            
            // Show success message and redirect to dashboard
            showAlert('Registration successful! Redirecting to dashboard...', 'success');
            
            setTimeout(function() {
                window.location.href = 'pages/dashboard.html';
            }, 2000);
        });
    }
    
    // Helper function to show alerts
    function showAlert(message, type) {
        // Check if alert container exists, if not create it
        let alertContainer = document.querySelector('.alert-container');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.className = 'alert-container position-fixed top-0 start-50 translate-middle-x mt-3';
            document.body.appendChild(alertContainer);
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Add to container
        alertContainer.appendChild(alert);
        
        // Auto dismiss after 5 seconds
        setTimeout(function() {
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}); 