import Component from '@components/scripts/base/Component';
import {mobile} from '@components/scripts/utils/mobile';

class LocationLayout extends Component {
    init() {
        if (!mobile()) {
            const side = this.el.querySelector('#lf-location-side');
            const media = this.el.querySelector('#lf-location-media');
            const actions = this.el.querySelector('#lf-location-actions');

            if (media !== null) {
                side.appendChild(media);
                media.classList.remove('hidden-md');
            }

            if (actions !== null) {
                side.appendChild(actions);
                actions.classList.remove('hidden-md');
            }

            side.parentElement.classList.remove('hidden-md');
        }
    }
}

export default LocationLayout;
