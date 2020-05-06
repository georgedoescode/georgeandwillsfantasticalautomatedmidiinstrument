import "normalize.css";
import "./assets/css/reset.css";
import "vue-select/dist/vue-select.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

import App from "./App.vue";
import Vue from "vue";
import vSelect from "vue-select";
import VueCodemirror from "vue-codemirror";
import store from "./store";

Vue.component("v-select", vSelect);

Vue.use(VueCodemirror, {
    options: {
        tabSize: 4,
        mode: "javascript",
        lineNumbers: true
    }
});

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
