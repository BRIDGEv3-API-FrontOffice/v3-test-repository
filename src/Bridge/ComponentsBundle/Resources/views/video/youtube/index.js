import Component from '@components/scripts/base/Component';
import {mobile} from '@components/scripts/utils/mobile';

const isMobile = mobile();

class VideoYoutube extends Component {
    init() {
        const youtube = this.el.getAttribute('data-lf-youtube');
        this.player = '';

        if (youtube) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('body')[0];
            firstScriptTag.appendChild(tag);
            let autoplay;

            // eslint-disable-next-line
            isMobile ? autoplay = 0 : autoplay = 1;

            this.bindEvents();

            window.onYouTubeIframeAPIReady = () => {
                // eslint-disable-next-line
                this.player = new YT.Player('youtube-player', {
                    videoId: youtube,
                    playerVars: {
                        autoplay: autoplay,
                        autohide: 1,
                        rel: 0,
                        showinfo: 0,
                        controls: 0,
                        enablejsapi: 1,
                        modestbranding: 1,
                        // eslint-disable-next-line
                        iv_load_policy: 3,
                        playlist: youtube
                    },
                    events: {
                        onReady: this.onPlayerReady,
                        onStateChange: this.onPlayerStateChange
                    }
                });
                this.getExpandResizeHandler();
            };
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.getExpandResizeHandler();
        });
    }

    getExpandResizeHandler() {
        const width = this.el.parentNode.offsetWidth;
        const height = this.el.parentNode.offsetHeight;
        const widthRatio = 16;
        const heightRatio = 9;
        const leftRatio = 2;
        const iframe = this.el.querySelector('iframe');

        if (width / height > widthRatio / heightRatio) {
            this.player.setSize(width, width / widthRatio * heightRatio);
            iframe.style.left = '0px';
        } else {
            this.player.setSize(height / heightRatio * widthRatio, height);
            iframe.style.left = `${-(iframe.offsetWidth - width) / leftRatio}px`;
        }
    }

    onPlayerReady(event) {
        if(!isMobile) {
            event.target.playVideo();
        }
        event.target.mute();
    }

    onPlayerStateChange(event) {
        if(!isMobile) {
            // eslint-disable-next-line
            if (event.data === YT.PlayerState.PAUSED) {
                event.target.playVideo();
            }
        }
    }
}

export default VideoYoutube;
