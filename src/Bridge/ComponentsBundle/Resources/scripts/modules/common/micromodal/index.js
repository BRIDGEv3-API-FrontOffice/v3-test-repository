import Component from '@components/scripts/base/Component';
import MicroModal from '../tmp_micromodal';

class Micromodal extends Component {
    init(eventEmitterService) {
        this.emitter = eventEmitterService;
        MicroModal.init({
            onShow: (modal, triggerElement) => {
                this.emitter.emit('component.modal.show.' + modal.id, modal, triggerElement);
            },
            onClose: (modal, triggerElement) => {
                this.emitter.emit('component.modal.close.' + modal.id, modal, triggerElement);
            },

            disableScroll: true,
            disableFocus: false,
            awaitOpenAnimation: false,
            awaitCloseAnimation: false,
            debugMode: false
        });

        this.bindEvents();
    }

    bindEvents() {
        this.emitter.on('components.modal.openModal', this.openModal.bind(this));
        this.emitter.on('components.modal.closeModal', this.closeModal.bind(this));
    }

    openModal(id) {
        MicroModal.show(id);
    }

    closeModal(id) {
        MicroModal.close(id);
    }
}

Micromodal.deps = ['eventEmitterService'];

export default Micromodal;
