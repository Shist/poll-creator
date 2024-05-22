import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import nodeHtmlLabel from "cytoscape-node-html-label";
import cytoscape from "cytoscape";

import vSelect from "vue-select";

import "bootstrap/dist/css/bootstrap.css";
import "vue-select/dist/vue-select.css";
import "./styles/main.scss";

const app = createApp(App);

app.use(router);
app.component("v-select", vSelect);
app.mount("#app");

cytoscape.use(nodeHtmlLabel);

import "bootstrap/dist/js/bootstrap.js";
