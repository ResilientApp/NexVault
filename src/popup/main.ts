import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.less";
import "@/styles/index.scss";
import "typeface-poppins";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).use(Antd).mount("#app");
