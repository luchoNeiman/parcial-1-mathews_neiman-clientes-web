<script>
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <nav class="w-full flex justify-between items-center p-4 bg-black text-white">
        <h1 class="text-xl font-bold">Cine Alternativo</h1>
        <ul class="flex gap-6">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/movies">Películas</router-link></li>
            <li><router-link to="/soundtracks">Soundtracks</router-link></li>
        </ul>
    </nav>
</template>