import Component from '../../../base/Component';
require('intersection-observer');

class LazyLoad extends Component {
    init() {
        const lazyImages = [].slice.call(this.el.querySelectorAll('img.lazy'));
        IntersectionObserver.prototype.POLL_INTERVAL = 100;

        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        this.loadSources(lazyImage);
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach((lazyImage) => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            lazyImages.forEach((lazyImage) => {
                this.loadSources(lazyImage);
            });
        }
    }

    loadSources(lazyImage) {
        lazyImage.src = lazyImage.dataset.src;
        if (lazyImage.dataset.srcset) {
            lazyImage.srcset = lazyImage.dataset.srcset;
        }
        if (lazyImage.dataset.sizes) {
            lazyImage.sizes = lazyImage.dataset.sizes;
        }
        lazyImage.classList.remove('lazy');
        lazyImage.classList.add('blur-out');
    }
}

export default LazyLoad;
