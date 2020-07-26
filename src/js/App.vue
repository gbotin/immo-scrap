<template>

    <main class="container-fluid p-0">

        <div class="row no-gutters">
            <div class="col-8">
                <os-map v-model="selection"/>
            </div>

            <div class="col-4">
                <div class="p-3">
                    <h3>Selection</h3>

                    <ul class="list-inline">
                        <li class="list-inline-item" v-for="s in selection" :key="`${s.name}-${s.zipcode}`">
                            <a href="#" class="badge badge-secondary" @click.prevent="removeSelected(s)">{{ s.name }} ({{ s.zipcode }})</a>
                        </li>
                    </ul>
                </div>


                <!-- <button @click="testquery" class="btn btn-secondary">test</button> -->
            </div>
        </div>

    </main>

</template>

<script>

    import LeboncoinConnector from './connectors/Leboncoin';


    import OSMap from './OSMap';
    import { find, reject } from 'lodash';

    export default {

        components: {
            osMap: OSMap,
        },

        data () {
            return {
                selection: [],
            };
        },

        methods: {
            removeSelected (selected) {
                this.selection = reject(this.selection, selected);
            },

            testquery () {
                const lbc = new LeboncoinConnector;
                lbc.query();
            }

        },

    };

</script>
