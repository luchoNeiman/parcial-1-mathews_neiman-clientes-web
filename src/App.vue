<script>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    components: { AppNavbar, AppFooter},
}
</script>

<template>
    <header>
        <AppNavbar />
    </header>
    <main class="container p-4 mx-auto">
        <RouterView />
    </main>
    <AppFooter />
</template>