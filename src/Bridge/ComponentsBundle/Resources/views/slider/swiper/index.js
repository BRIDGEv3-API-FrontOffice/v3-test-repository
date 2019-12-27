import Component from '@components/scripts/base/Component';
import Swiper from 'swiper/js/swiper.min.js';

const objectAssign = require('object-assign');
const MIN_PAGINATION = 2;

class SliderSwiper extends Component {
    init(eventEmitterService) {
        this.emitter = eventEmitterService;
        this.options = objectAssign({
            init: false,
            on: {
                resize: this.hidePagination
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function(index, className) {
                    return '<li aria-selected="false" class="' + className + '"></li>';
                }
            },
            simulateTouch: false,
            slidesPerView: 1,
            spaceBetween: 15,
            breakpointsInverse: true,
            watchOverflow: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            slideVisibleClass: 'swiper-slide-visible',
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                992: {
                    slidesPerView: 3
                }
            }
        }, this.attr.options);

        const swiper = new Swiper(this.el, this.options); // eslint-disable-line no-new
        const idModal = this.el.getAttribute('data-lf-idmodal');

        swiper.on('init', () => {
            this.hidePagination();
            this.changeAttributes();
        });

        swiper.on('slideChange', () => {
            this.changeAttributes();
        });

        // test if init is directly launched or after modal open
        if (idModal && idModal !== 'false') {
            //const modal = document.querySelector('#' + idModal);
            this.emitter.on('components.modal.openModal', () => {
                swiper.init();
            });
        } else {
            swiper.init();
        }

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    handleWindowResize() {
        setTimeout(() => {
            this.hidePagination();
        }, 500); // eslint-disable-line no-magic-numbers
    }

    hidePagination() {
        if (this.options) {
            const pagination = this.el.querySelector(this.options.pagination.el);
            if (pagination) {
                const paginationItems = this.el.querySelectorAll('.swiper-pagination-bullet').length;
                if (paginationItems < MIN_PAGINATION) {
                    pagination.style.display = 'none';
                } else {
                    pagination.style.display = 'block';
                }
            }
        }
    }

    changeAttributes() {
        const regex = /active/;
        const liList = this.el.getElementsByTagName('li');
        const bulletsLabel = this.el.getAttribute('data-lf-bullets-label');
        for (const liElt of liList) {
            const defaultLabel = liElt.getAttribute('aria-label');
            const numberSlide = defaultLabel.substr(defaultLabel.length - 1);
            const label = bulletsLabel + ' ' + numberSlide;
            liElt.setAttribute('aria-label', label);
            liElt.setAttribute('role', 'tab');
            if (regex.test(liElt.className)) {
                liElt.setAttribute('aria-selected', true);
            } else {
                liElt.setAttribute('aria-selected', false);
            }
        }
    }
}

SliderSwiper.deps = ['eventEmitterService'];

export default SliderSwiper;
