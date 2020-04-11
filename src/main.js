import "normalize.css";
import "./assets/css/reset.css";
import "vue-select/dist/vue-select.css";

import App from "./App.vue";
import Vue from "vue";
import vSelect from "vue-select";

Vue.component("v-select", vSelect);

new Vue({
    el: "#app",
    render: h => h(App)
});
