import './assets/main.css'
import 'primevue/resources/themes/lara-light-teal/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: 'places'
  }
})

app.mount('#app')
