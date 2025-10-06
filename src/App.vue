<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar, Footer },
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