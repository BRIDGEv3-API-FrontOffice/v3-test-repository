class NotificationsForm {
    /* eslint no-magic-numbers: ["error", { "ignore": [8000, 13] }] */

    hide(el) {
        el.classList.remove('active');
        el.setAttribute('aria-hidden', 'true');
    }

    show(el) {
        el.classList.add('active');
        el.setAttribute('aria-hidden', 'false');
    }

    reset(form) {
        const blockNotifAll = form.parentElement.querySelector('[data-notifications-items]');
        const notifButton = blockNotifAll.querySelector('[data-notifications-button]');
        notifButton.parentElement.classList.remove('--btn-actif');

        this.hide(blockNotifAll);
        this.show(form);
        notifButton.disabled=true;
    }

    displayNotifSuccess(message, form, emitter, modal) {
        const blockNotifAll = form.parentElement.querySelector('[data-notifications-items]');
        const notifButton = blockNotifAll.querySelector('[data-notifications-button]');

        this.displayNotifText(blockNotifAll, true, message);
        notifButton.disabled=false;
        this.hide(form);
        this.show(blockNotifAll);

        notifButton.addEventListener('click', (e) => {
            e.preventDefault();
            emitter.emit('components.modal.closeModal', modal);
        });
    }

    displayNotifFail(message, form) {
        const blockNotifAll = form.parentElement.querySelector('[data-notifications-items]');
        const notifButton = blockNotifAll.querySelector('[data-notifications-button]');

        this.displayNotifText(blockNotifAll, false, message);
        this.hide(notifButton.parentElement);
        this.show(blockNotifAll);
    }

    displayNotifText(blockNotifAll, success, message) {
        const notifText = blockNotifAll.querySelector('[data-notifications-text]');
        const notifClass = success ? 'success' : 'fail';
        notifText.innerHTML = message;
        blockNotifAll.classList.add(notifClass);
    }
}

module.exports = NotificationsForm;
