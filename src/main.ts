import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

// import Bootstrap assets
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/jquery/dist/jquery.slim.min.js";
import "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

const stateStore = createPinia();
const app = createApp(App);
app.use(stateStore);
app.mount("#app");
