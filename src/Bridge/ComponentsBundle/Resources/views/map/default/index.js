import Component from '@components/scripts/base/Component';
import { mobile } from '@components/scripts/utils/mobile';

require(`batMap/dist/${window.batmapProvider||'mappy'}`);

class Map extends Component {
    getDefaultAttributes() {
        return {
            showCluster: true,
            showPosition: true,
            showLabel: true,
            showInfoWindow: true,
            options: {
                zoom: 12,
                locationZoom: 16
            },
            markers: {},
            labels: {
                color: 'white',
                font: 'Arial, sans-serif',
                size: '12px',
                weight: 'normal'
            },
            clusters: {},
            pagination: {
                hitsStart: 1
            },
            enableMarkerEvents: true,
            defaultMarker: 'default'
        };
    }

    init(eventEmitterService, urlService) {
        this.emitter = eventEmitterService;
        this.urlService = urlService;

        this.lastMarkerFocused = null;

        this.mapContainer = document.querySelector('[data-lf-map]');

        this.userCoordinates = {
            latitude: this.urlService.getUrlParameter('lat'),
            longitude: this.urlService.getUrlParameter('lon')
        };
        this.isGeolocation = this.urlService.getUrlParameter('geo');

        this.map = new window.BatMap(
            this.el.querySelector('[data-lf-map-canvas]'),
            this.attr.apiKey,
            this.attr.locale,
            this.attr.showCluster,
            this.attr.showLabel,
            this.attr.showPosition,
            this.initMap.bind(this)
        );
    }

    bindEvents() {
        this.emitter.on('components.map.focusOnMarker', this.focusOnMarker.bind(this));
        this.emitter.on('components.map.setIconOnMarker', this.setIconOnMarker.bind(this));
        this.emitter.on('components.map.setMarkerStatus', this.setMarkerStatus.bind(this));
    }

    initMap() {
        this.setMapOptions();

        this.map.initMap();

        this.setMarkerIcons();
        this.geolocateOnMap();
        this.setPoints();
        this.addMarkers();

        if (!this.attr.showLabel && !this.attr.showCluster) {
            this.map.listenZoomChange(zoom => {
                this.map.minifyMarkerIcons(zoom);
            });
        }

        this.panToAllMarkers();

        if (this.attr.enableMarkerEvents) {
            this.bindEvents();
        }
    }

    setMapOptions() {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels, this.attr.clusters);
    }

    setPoints() {
        [].forEach.call(this.attr.locations, location => {
            let label = false;

            if (this.attr.showLabel) {
                label = `${this.attr.pagination.hitsStart++}`;
            }

            this.map.setPoint(location, this.attr.defaultMarker, label);
        });
    }

    getPoints() {
        return this.map.getPoints();
    }

    setMarkerIcons() {
        this.map.setMarkerIcons();
    }

    setIconOnMarker(marker, iconType) {
        this.map.setIconOnMarker(marker, iconType);
    }

    focusOnMarker(id) {
        const marker = this.map.getMarker(id);

        if (this.lastMarkerFocused !== marker.id) {
            this.lastMarkerFocused = marker.id;

            [].forEach.call(this.getMarkers(), m => {
                this.setIconOnMarker(m, this.attr.defaultMarker);
            });
            this.setIconOnMarker(marker, 'active');

            this.map.focusOnMarker(marker);
        }

        if (!mobile() && this.attr.showInfoWindow) {
            this.emitter.emit('components.infowindow.getInfowindow', marker.location);
        }
    }

    addMarkers() {
        const events = this.attr.enableMarkerEvents ? {
            click: this.handleClickOnMarker.bind(this),
            mouseover: this.handleMouseEnterOnMarker.bind(this),
            mouseout: this.handleMouseLeaveOnMarker.bind(this)
        } : {};
        this.map.addMarkers(events);
    }

    getMarkers() {
        return this.map.getMarkers();
    }

    geolocateOnMap() {
        if (this.userCoordinates.latitude && this.userCoordinates.longitude && this.attr.showPosition && this.isGeolocation) {
            this.map.addUserMarker({
                latitude: parseFloat(this.userCoordinates.latitude),
                longitude: parseFloat(this.userCoordinates.longitude)
            }, 'user');
        }
    }

    panToAllMarkers() {
        if (this.getMarkers().length > 1) {
            this.map.fitBounds(this.map.getBounds(), this.attr.options.zoom);
        } else {
            this.map.fitBounds(this.map.getBounds(), this.attr.options.locationZoom);
        }
    }

    getMarkerIconType(marker) {
        return this.map.getMarkerIconType(marker);
    }

    setMarkerStatus(marker, status) {
        switch (status) {
            case 'hover':
                if (this.getMarkerIconType(marker) !== 'active') {
                    this.setIconOnMarker(marker, 'hover');
                }
                break;

            default:
                if (this.getMarkerIconType(marker) !== 'active') {
                    this.setIconOnMarker(marker, this.attr.defaultMarker);
                }
                break;
        }
    }

    handleClickOnMarker(marker) {
        return () => {
            this.emitter.emit('modules.mapInteraction.focusOnLocation', marker.id);
        };
    }

    handleMouseEnterOnMarker(marker) {
        return () => {
            this.setMarkerStatus(marker, 'hover');
        };
    }

    handleMouseLeaveOnMarker(marker) {
        return () => {
            this.setMarkerStatus(marker, this.attr.defaultMarker);
        };
    }
}

Map.deps = ['eventEmitterService', 'urlService'];

export default Map;
