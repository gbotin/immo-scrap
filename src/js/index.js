import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

const lat = 50.633479;
const lng = 3.033043;

const center = fromLonLat([lng, lat]);

var style = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.15)',
    }),
    stroke: new Stroke({
        color: '#319FD3',
        width: 1,
    }),
    text: new Text({
        overflow: true,
        font: '12px Calibri, sans-serif',
        fill: new Fill({
            color: '#000',
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 3,
        })
    })
});

var highlightStyle = new Style({
    stroke: new Stroke({
        color: '#f00',
        width: 1,
    }),
    fill: new Fill({
        color: 'rgba(255, 0, 0, 0.1)'
    }),
});

const overlay = new VectorLayer({
    source: new VectorSource(),
    style: () => highlightStyle,
});

var map = new Map({
    target: document.querySelector('.js-map'),
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        new VectorLayer({
            source: new VectorSource({
                url: '/dist/img/communes.geojson',
                format: new GeoJSON()
            }),
            style (feature) {
                style.getText().setText(feature.get('nom'));
                return style;
            },
        }),
        overlay,
    ],
    view: new View({
        center,
        zoom: 12,
    })
});

map.on('click', function(event) {
    var highlight = true;

    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        let vector = overlay.getSource();

        if (!highlight) {
            return;
        }

        if(!vector.hasFeature(feature) && layer) {
            vector.addFeature(feature);
        } else {
            vector.removeFeature(feature);
            highlight = false;
        }
    });
});
