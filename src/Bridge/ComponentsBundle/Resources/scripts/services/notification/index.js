class NotificationService {
    /* eslint no-magic-numbers: ["error", { "ignore": [5000] }] */
    display(title, message, status, time = 5000) {
        const notification = document.querySelector('[data-lf-notification]');

        if (notification) {
            const notificationTitle = notification.querySelector('[data-lf-notification-title]');
            const notificationMessage = notification.querySelector('[data-lf-notification-msg]');

            if (notificationTitle && notificationMessage && !notification.classList.contains('active')) {
                notificationTitle.innerHTML = title;
                notificationMessage.innerHTML = message;
                notification.classList.remove('inactive', 'success', 'warning', 'error');
                notification.classList.add('active', status);

                setTimeout(() => {
                    notification.classList.add('inactive');
                    notification.classList.remove('active');
                }, time);
            }
        }
    }
}

module.exports = NotificationService;
