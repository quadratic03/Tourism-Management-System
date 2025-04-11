/**
 * Tourist Management System
 * Notifications Module
 */

// Global notifications state
const notificationState = {
    unread: 0,
    notifications: [],
    settings: {
        email: true,
        push: true,
        desktop: true
    }
};

// Initialize notifications when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    loadNotificationSettings();
    
    // Set up notification handlers
    setupNotificationHandlers();
    
    // Check for notification permission
    checkNotificationPermission();
});

/**
 * Initialize the notification system
 */
function initializeNotifications() {
    // Load any saved notifications from localStorage
    const savedNotifications = localStorage.getItem('tms_notifications');
    if (savedNotifications) {
        try {
            const parsedNotifications = JSON.parse(savedNotifications);
            notificationState.notifications = parsedNotifications.notifications || [];
            notificationState.unread = parsedNotifications.unread || 0;
        } catch (e) {
            console.error('Error parsing saved notifications:', e);
            notificationState.notifications = [];
            notificationState.unread = 0;
        }
    } else {
        // Add some demo notifications
        addDemoNotifications();
    }
    
    // Update UI
    updateNotificationBadge();
    renderNotifications();
}

/**
 * Load notification settings from localStorage
 */
function loadNotificationSettings() {
    const savedSettings = localStorage.getItem('tms_notification_settings');
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            notificationState.settings = {
                ...notificationState.settings,
                ...parsedSettings
            };
        } catch (e) {
            console.error('Error parsing notification settings:', e);
        }
    }
}

/**
 * Set up event handlers for notification-related UI elements
 */
function setupNotificationHandlers() {
    // Notification button click (in header)
    const notificationBtn = document.querySelector('.header-controls .header-btn:nth-child(2)');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleNotificationDropdown();
        });
        
        // Create notification dropdown
        createNotificationDropdown();
    }
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('notificationDropdown');
        const notificationBtn = document.querySelector('.header-controls .header-btn:nth-child(2)');
        
        if (dropdown && notificationBtn && !dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Save notification settings when forms are submitted
    document.querySelectorAll('#emailNotificationForm, #pushNotificationForm, #desktopNotificationForm').forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                saveNotificationSettings();
            });
        }
    });
    
    // Master toggle for all notifications
    const masterToggle = document.getElementById('masterNotificationsToggle');
    if (masterToggle) {
        masterToggle.addEventListener('change', function() {
            saveNotificationSettings();
        });
    }
}

/**
 * Create the notification dropdown UI
 */
function createNotificationDropdown() {
    const dropdown = document.createElement('div');
    dropdown.id = 'notificationDropdown';
    dropdown.className = 'notification-dropdown';
    
    // Add styles to the header
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .notification-dropdown {
            position: absolute;
            top: 60px;
            right: 80px;
            width: 350px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 1000;
            overflow: hidden;
            display: none;
        }
        
        .notification-dropdown.show {
            display: block;
        }
        
        .notification-header {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-title {
            font-weight: 600;
            margin: 0;
        }
        
        .notification-list {
            max-height: 350px;
            overflow-y: auto;
        }
        
        .notification-item {
            padding: 12px 15px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            align-items: flex-start;
            transition: background-color 0.2s;
        }
        
        .notification-item:hover {
            background-color: #f9f9f9;
        }
        
        .notification-item.unread {
            background-color: #f0f7ff;
        }
        
        .notification-icon {
            margin-right: 12px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-message {
            margin: 0 0 5px 0;
            font-size: 14px;
        }
        
        .notification-time {
            font-size: 12px;
            color: #6c757d;
            margin: 0;
        }
        
        .notification-footer {
            padding: 10px 15px;
            border-top: 1px solid #eee;
            text-align: center;
        }
        
        .notification-footer a {
            color: var(--primary-color);
            text-decoration: none;
            font-size: 14px;
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Add dropdown to the document
    document.body.appendChild(dropdown);
}

/**
 * Toggle the notification dropdown visibility
 */
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    
    if (dropdown) {
        const isShown = dropdown.classList.toggle('show');
        
        if (isShown) {
            renderNotifications();
            
            // Mark as read when opening
            markAllAsRead();
        }
    }
}

/**
 * Render notifications in the dropdown
 */
function renderNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    // Clear existing content
    dropdown.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'notification-header';
    header.innerHTML = `
        <h6 class="notification-title">Notifications</h6>
        <button class="btn btn-sm btn-link p-0" id="markAllReadBtn">Mark all as read</button>
    `;
    dropdown.appendChild(header);
    
    // Create notification list
    const list = document.createElement('div');
    list.className = 'notification-list';
    
    if (notificationState.notifications.length === 0) {
        list.innerHTML = `<div class="text-center p-4 text-muted">No notifications</div>`;
    } else {
        notificationState.notifications.forEach((notification, index) => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? '' : 'unread'}`;
            item.dataset.index = index;
            
            let iconClass = 'fa-bell';
            
            switch (notification.type) {
                case 'booking':
                    iconClass = 'fa-calendar-check';
                    break;
                case 'tourist':
                    iconClass = 'fa-user';
                    break;
                case 'system':
                    iconClass = 'fa-cog';
                    break;
                case 'alert':
                    iconClass = 'fa-exclamation-circle';
                    break;
            }
            
            item.innerHTML = `
                <div class="notification-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <p class="notification-time">${formatTimeAgo(notification.timestamp)}</p>
                </div>
            `;
            
            // Add click handler to mark individual notification as read
            item.addEventListener('click', function() {
                markAsRead(index);
                
                // If notification has a link, navigate to it
                if (notification.link) {
                    window.location.href = notification.link;
                }
            });
            
            list.appendChild(item);
        });
    }
    
    dropdown.appendChild(list);
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'notification-footer';
    footer.innerHTML = `<a href="../settings/notifications.html">Notification Settings</a>`;
    dropdown.appendChild(footer);
    
    // Add event handler for mark all as read button
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            markAllAsRead();
        });
    }
}

/**
 * Add demo notifications for testing
 */
function addDemoNotifications() {
    const now = Date.now();
    
    notificationState.notifications = [
        {
            id: generateId(),
            type: 'booking',
            message: 'New booking #BK001 from John Smith',
            timestamp: now - 1000 * 60 * 5, // 5 minutes ago
            read: false,
            link: '../bookings/index.html'
        },
        {
            id: generateId(),
            type: 'tourist',
            message: 'New tourist registration: Alice Johnson',
            timestamp: now - 1000 * 60 * 30, // 30 minutes ago
            read: false,
            link: '../tourists/index.html'
        },
        {
            id: generateId(),
            type: 'system',
            message: 'System update scheduled for tomorrow',
            timestamp: now - 1000 * 60 * 60 * 2, // 2 hours ago
            read: true
        },
        {
            id: generateId(),
            type: 'alert',
            message: 'Weather alert: Heavy rain expected in Tokyo area',
            timestamp: now - 1000 * 60 * 60 * 24, // 1 day ago
            read: true
        }
    ];
    
    notificationState.unread = notificationState.notifications.filter(n => !n.read).length;
    
    // Save to localStorage
    saveNotifications();
}

/**
 * Add a new notification
 * @param {Object} notification - The notification object to add
 */
function addNotification(notification) {
    const defaultNotification = {
        id: generateId(),
        timestamp: Date.now(),
        read: false
    };
    
    const newNotification = { ...defaultNotification, ...notification };
    
    // Add to the beginning of the array
    notificationState.notifications.unshift(newNotification);
    
    // Update unread count
    if (!newNotification.read) {
        notificationState.unread++;
    }
    
    // Save to localStorage
    saveNotifications();
    
    // Update UI
    updateNotificationBadge();
    
    // Show desktop notification if enabled
    if (notificationState.settings.desktop && Notification.permission === 'granted') {
        showDesktopNotification(newNotification);
    }
}

/**
 * Show a desktop notification
 * @param {Object} notification - The notification object
 */
function showDesktopNotification(notification) {
    if (!('Notification' in window)) return;
    
    const title = 'Tourist Management System';
    const options = {
        body: notification.message,
        icon: '/favicon.ico'
    };
    
    new Notification(title, options);
}

/**
 * Check for desktop notification permission
 */
function checkNotificationPermission() {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'default' && notificationState.settings.desktop) {
        Notification.requestPermission();
    }
}

/**
 * Mark a notification as read
 * @param {number} index - The index of the notification to mark as read
 */
function markAsRead(index) {
    if (notificationState.notifications[index] && !notificationState.notifications[index].read) {
        notificationState.notifications[index].read = true;
        notificationState.unread = Math.max(0, notificationState.unread - 1);
        
        // Save to localStorage
        saveNotifications();
        
        // Update UI
        updateNotificationBadge();
        renderNotifications();
    }
}

/**
 * Mark all notifications as read
 */
function markAllAsRead() {
    notificationState.notifications.forEach(notification => {
        notification.read = true;
    });
    
    notificationState.unread = 0;
    
    // Save to localStorage
    saveNotifications();
    
    // Update UI
    updateNotificationBadge();
    renderNotifications();
}

/**
 * Update the notification badge in the header
 */
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        if (notificationState.unread > 0) {
            badge.style.display = 'flex';
            badge.setAttribute('data-count', notificationState.unread);
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Add or update CSS for the badge
    let style = document.getElementById('notification-badge-style');
    
    if (!style) {
        style = document.createElement('style');
        style.id = 'notification-badge-style';
        document.head.appendChild(style);
    }
    
    style.textContent = `
        .notification-badge {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #dc3545;
            color: white;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-badge:empty {
            display: none;
        }
        
        .notification-badge::after {
            content: attr(data-count);
        }
    `;
}

/**
 * Format a timestamp to a relative time string (e.g., "5 minutes ago")
 * @param {number} timestamp - The timestamp in milliseconds
 * @returns {string} - The formatted time string
 */
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

/**
 * Generate a unique ID for notifications
 * @returns {string} - The generated ID
 */
function generateId() {
    return 'nt-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save notifications to localStorage
 */
function saveNotifications() {
    localStorage.setItem('tms_notifications', JSON.stringify({
        notifications: notificationState.notifications,
        unread: notificationState.unread
    }));
}

/**
 * Save notification settings to localStorage
 */
function saveNotificationSettings() {
    const settings = {
        email: document.getElementById('emailNotificationsToggle')?.checked ?? true,
        push: document.getElementById('pushNotificationsToggle')?.checked ?? true,
        desktop: document.getElementById('desktopNotificationsToggle')?.checked ?? true
    };
    
    notificationState.settings = settings;
    localStorage.setItem('tms_notification_settings', JSON.stringify(settings));
}

/**
 * Create and show a test notification (for demo purposes)
 */
function createTestNotification() {
    addNotification({
        type: Math.random() > 0.5 ? 'booking' : 'tourist',
        message: `Test notification: ${new Date().toLocaleTimeString()}`,
        timestamp: Date.now()
    });
}

// Export functionality for global use
window.tmsNotifications = {
    add: addNotification,
    markAllAsRead: markAllAsRead,
    createTest: createTestNotification
}; 