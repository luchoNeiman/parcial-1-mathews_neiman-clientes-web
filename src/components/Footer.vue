<script>
export default {
    name: 'Footer',
}
</script>

<template>
    <footer class="w-full bg-[#0A0A0A] border-t border-[#EFB810]/40 text-gray-400 py-6 sm:py-8 mt-12">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center gap-3 sm:gap-4">
                <div class="text-center space-y-2">
                    <p class="text-sm sm:text-base leading-relaxed">
                        © 2025 <span class="text-[#EFB810] font-semibold">Underground Cinema</span>
                    </p>
                    <p class="text-xs sm:text-sm text-gray-500">
                        Proyecto académico de
                        <span class="text-white font-medium">Evelyn Mathews</span> y
                        <span class="text-white font-medium">Luciano Neiman</span>
                    </p>
                </div>

                <div class="border-t border-gray-800 pt-3 sm:pt-4 w-full max-w-md">
                    <p class="text-xs sm:text-sm text-gray-500 hover:text-[#EFB810] transition cursor-default text-center italic">
                        "El cine independiente también merece una ovación."
                    </p>
                </div>

                <div class="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                    <span class="text-gray-600">Clientes Web Mobile</span>
                    <span class="text-gray-700">•</span>
                    <span class="text-gray-600">2025</span>
                </div>
            </div>
        </div>
    </footer>
</template>
