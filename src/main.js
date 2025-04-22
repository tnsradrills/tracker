if (!Array.prototype.at) {
  Array.prototype.at = function (index) {
    index = Math.trunc(index) || 0;
    if (index < 0) index += this.length;
    if (index < 0 || index >= this.length) return undefined;
    return this[index];
  };
}

import { createApp } from "vue";
import { createPinia } from "pinia";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import router from "./routes/routes.js";

const vuetify = createVuetify({
  components,
  directives,
});
const pinia = createPinia();

createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
