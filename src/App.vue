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
        <!-- 
        RouterView es donde se va a montar el componente asociar a la ruta que se
        esté visitando.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>