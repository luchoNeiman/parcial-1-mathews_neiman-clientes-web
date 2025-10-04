import './style.css'
import { createApp } from 'vue'
import router from "./router/router";
import App from './App.vue'

const app = createApp(App);
app.use(router); // Registramos el router.
app.mount('#app');
