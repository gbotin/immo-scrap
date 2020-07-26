<template>

    <div ref="holder" class="map"></div>

</template>

<script>

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

    import { find, reject } from 'lodash';

    export default {

        props: {
            value: {
                type: Array,
                default: [],
            },
            lat: {
                type: Number,
                default: 50.633479
            },
            lng: {
                type: Number,
                default: 3.033043
            }
        },

        data () {
            return {
                map: null,

                selected: this.value,

                style: new Style({
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
                }),

                highlightStyle: new Style({
                    stroke: new Stroke({
                        color: '#f00',
                        width: 1,
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.1)'
                    }),
                }),

                vector: new VectorLayer({
                    source: new VectorSource({
                        url: '/dist/img/communes.geojson',
                        format: new GeoJSON()
                    }),
                    style: (feature) => {
                        this.style.getText().setText(feature.get('nom'));
                        return this.style;
                    },
                }),

                overlay: new VectorLayer({
                    source: new VectorSource(),
                    style: () => this.highlightStyle,
                }),
            };
        },

        mounted () {
            this.map = new Map({
                target: this.$el,
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                    this.vector,
                    this.overlay,
                ],
                view: new View({
                    center: this.center,
                    zoom: 12,
                })
            });

            this.map.on('click', (event) => {
                this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                    if (this.hasSelectedFeature(feature)) {
                        this.removeFeature(feature);
                    } else {
                        this.selectFeature(feature);
                    }
                });
            });
        },

        computed: {
            center () {
                return fromLonLat([
                    this.lng,
                    this.lat
                ]);
            }
        },

        methods: {
            formatFeature (feature) {
                return {
                    zipcode: feature.get('code'),
                    name: feature.get('nom'),
                }
            },

            hasSelectedFeature (feature) {
                return find(this.value, this.formatFeature(feature)) != undefined
            },

            selectFeature (feature) {
                if (this.hasSelectedFeature(feature)) {
                    return;
                }

                this.selected.push(this.formatFeature(feature));
            },

            removeFeature (feature) {
                if (!this.hasSelectedFeature(feature)) {
                    return;
                }

                this.selected = reject(this.selected, this.formatFeature(feature));
            }
        },

        watch: {
            value () {
                let source = this.overlay.getSource();

                this.vector.getSource().getFeatures().forEach((feature) => {

                    if (this.hasSelectedFeature(feature) && !source.hasFeature(feature)) {
                        source.addFeature(feature);
                    }

                    if (!this.hasSelectedFeature(feature) && source.hasFeature(feature)) {
                        source.removeFeature(feature);
                    }
                });

            },

            selected () {
                this.$emit('input', this.selected);
            }
        },

    };

</script>
