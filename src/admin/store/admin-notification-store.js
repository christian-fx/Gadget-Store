
export const AdminNotificationStore = {
    _notifications: [],
    _listeners: [],

    init() {
        // Load from local storage
        const stored = localStorage.getItem('admin_notifications');
        if (stored) {
            this._notifications = JSON.parse(stored);
        }
    },

    getAll() {
        return this._notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    getUnreadCount() {
        return this._notifications.filter(n => !n.read).length;
    },

    add(title, message, type = 'info') {
        const notification = {
            id: Date.now().toString(),
            title,
            message,
            type, // 'info', 'success', 'warning', 'error'
            timestamp: new Date().toISOString(),
            read: false
        };

        this._notifications.unshift(notification);
        this._save();
        this._notifyListeners();
        return notification;
    },

    markAsRead(id) {
        const notification = this._notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this._save();
            this._notifyListeners();
        }
    },

    remove(id) {
        this._notifications = this._notifications.filter(n => n.id !== id);
        this._save();
        this._notifyListeners();
    },

    markAllAsRead() {
        this._notifications.forEach(n => n.read = true);
        this._save();
        this._notifyListeners();
    },

    clearAll() {
        this._notifications = [];
        this._save();
        this._notifyListeners();
    },

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    },

    _save() {
        // Limit to last 50 notifications to prevent storage bloat
        if (this._notifications.length > 50) {
            this._notifications = this._notifications.slice(0, 50);
        }
        localStorage.setItem('admin_notifications', JSON.stringify(this._notifications));
    },

    _notifyListeners() {
        this._listeners.forEach(listener => listener(this._notifications));
    }
};
