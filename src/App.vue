<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar, Footer },
}
</script>

<!-- <template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <Navbar />
    <main class="container mx-auto flex-grow p-4 mt-20">
      <router-view />
    </main>
    <Footer />
  </div>
</template> -->


<template>
  <div class="min-h-screen bg-[#121212] text-white flex flex-col">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>