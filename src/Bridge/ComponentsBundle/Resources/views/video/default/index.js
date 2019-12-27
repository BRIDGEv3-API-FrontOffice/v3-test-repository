import Component from '@components/scripts/base/Component';

class VideoDefault extends Component {
    init() {
        const video = this.el.querySelector('video');
        if (video) {
            if (video.paused) {
                video.play();
            }
        }
    }
}

export default VideoDefault;
