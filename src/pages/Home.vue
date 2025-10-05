<script>
export default {
    name: 'Home',
    components: {}
}
</script>

<template>
    <section class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 class="text-4xl font-bold mb-4">Cine Alternativo</h1>
        <p class="max-w-xl text-gray-300">
            Bienvenido a la enciclopedia de cine alternativo: un espacio donde los fans descubren películas de culto,
            comparten opiniones y celebran el cine fuera del circuito comercial.
        </p>

        <router-link to="/movies" class="mt-6 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition">
            Explorar películas
        </router-link>
    </section>
</template>