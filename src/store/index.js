import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        transportPosition: 0
    },
    mutations: {
        progressTransport(state) {
            state.transportPosition++;
        }
    },
    actions: {},
    modules: {}
});
