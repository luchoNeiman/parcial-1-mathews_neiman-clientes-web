<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import { recordVisit } from './services/visits';

export default {
  name: 'App',
  components: { Navbar, Footer },
  async mounted() {
    await recordVisit();
  },
}
</script>

<template>
  <div class="min-h-screen bg-[#121212] text-white flex flex-col">
    <header>
      <Navbar />
    </header>
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>