import Component from '@components/scripts/base/Component';
import SliderSwiper from '@components/views/slider/swiper';

class PublicationsNewsDefault extends Component {
    init() {
        this.slider = new SliderSwiper(this.el.querySelector(`#${this.el.id}-slider`), this.attr);
        this.slider.init();
    }
}

export default PublicationsNewsDefault;
