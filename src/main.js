import "normalize.css";
import "./assets/css/reset.css";

import App from "./App.vue";
import Vue from "vue";
import store from "./store";

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
