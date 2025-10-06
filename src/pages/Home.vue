<script>
export default {
    name: 'Home',
}
</script>

<template>
    <!-- Contenedor principal -->
    <section
        class="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden pt-24">
        <!-- VIDEO DE FONDO -->
        <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover brightness-[0.4]">
            <source src="/cinema-background.mp4" type="video/mp4" />
            
        </video>

        <!-- OVERLAY (capa oscura opcional para mejorar contraste) -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- CONTENIDO -->
        <div class="relative z-10 px-4">
            <h1 class="text-5xl font-bold mb-6 text-[#EFB810] drop-shadow-md">
                Cine Alternativo
            </h1>

            <p class="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
                Bienvenido a la enciclopedia del underground cinema: un espacio donde los fans descubren películas de
                culto, comparten opiniones y celebran el cine fuera del circuito comercial.
            </p>

            <RouterLink to="/movies"
                class="inline-block mt-8 px-8 py-3 bg-[#EFB810] text-black font-semibold rounded hover:bg-yellow-400 transition">
                Explorar películas
            </RouterLink>
        </div>
    </section>
</template>
