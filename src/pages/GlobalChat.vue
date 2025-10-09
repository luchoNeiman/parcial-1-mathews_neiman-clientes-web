<script>
import { subscribeToAuthStateChanges } from '../services/auth'
import { getMessages, sendMessage, subscribeToMessages } from '../services/global-chat'

let unsubscribeFromAuth = () => { }
let unsubscribeFromChat = () => { }

export default {
    name: 'GlobalChat',

    data() {
        return {
            messages: [],
            newMessage: { content: '' },
            user: {
                id: null,
                email: null,
                username: null,
                avatar_url: null,
            },
        }
    },

    methods: {
        async handleSubmit() {
            try {
                if (!this.newMessage.content.trim()) return

                // Enviar mensaje correctamente con los tres parámetros
                await sendMessage(
                    this.user.id,
                    this.user.username,
                    this.user.email,
                    this.newMessage.content.trim(),
                    this.user.avatar_url
                )

                this.newMessage.content = ''
            } catch (error) {
                console.error('[GlobalChat.vue] Error al enviar mensaje:', error.message)
            }
        },

        getLinkForUser(senderId) {
            return this.user.id !== senderId ? `/usuario/${senderId}` : '/mi-perfil'
        },

        scrollToBottom() {
            if (this.$refs.chatContainer) {
                this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
            }
        },
    },

    async mounted() {
        // Detectar usuario logueado
        unsubscribeFromAuth = subscribeToAuthStateChanges(
            (newUserState) => (this.user = newUserState)
        )

        // Suscripción en tiempo real
        unsubscribeFromChat = subscribeToMessages(async (newMessage) => {
            this.messages.push(newMessage)
            await this.$nextTick()
            this.scrollToBottom()
        })

        // Cargar mensajes iniciales
        this.messages = await getMessages()
        await this.$nextTick()
        this.scrollToBottom()
    },

    unmounted() {
        unsubscribeFromAuth()
        unsubscribeFromChat()
    },
}
</script>

<template>
    <section class="flex flex-col h-[calc(100vh-80px)] bg-[#121212] text-white">
        <!-- Header estilo Instagram -->
        <div class="flex items-center justify-center p-4 border-b border-gray-800 bg-[#1C1C1C]">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                    <div class="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                        <svg class="w-4 h-4 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <h1 class="text-lg font-semibold text-white">Comunidad</h1>
            </div>
        </div>

        <!-- Contenedor del chat -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style="scroll-behavior: smooth;">
            <div v-for="message in messages" :key="message.id" class="flex items-start gap-3"
                :class="{ 'flex-row-reverse': message.sender_id === user.id }">

                <!-- Avatar con gradiente Instagram -->
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 flex-shrink-0">
                    <img :src="message.avatar_url || '/default-avatar.png'" alt="avatar"
                        class="w-full h-full rounded-full object-cover bg-[#121212]" />
                </div>

                <!-- Contenido del mensaje -->
                <div class="flex-1 min-w-0"
                    :class="{ 'text-right': message.sender_id === user.id }">

                    <!-- Username y timestamp -->
                    <div class="flex items-center gap-2 mb-1"
                        :class="{ 'justify-end': message.sender_id === user.id }">
                        <RouterLink :to="getLinkForUser(message.sender_id)"
                            class="font-semibold text-sm text-[#EFB810] hover:text-yellow-400 transition">
                            {{ message.username || message.email.split('@')[0] }}
                        </RouterLink>
                        <span class="text-gray-500 text-xs">
                            {{ new Date(message.created_at).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}
                        </span>
                    </div>

                    <!-- Burbuja de mensaje estilo Instagram -->
                    <div :class="[
                        'inline-block max-w-[280px] px-4 py-2 rounded-2xl text-sm break-words',
                        message.sender_id === user.id
                            ? 'bg-[#EFB810] text-black rounded-br-md'
                            : 'bg-[#2C2C2C] text-white rounded-bl-md border border-gray-700',
                    ]">
                        {{ message.content }}
                    </div>
                </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="!messages.length" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 mb-4">
                    <div class="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                        <svg class="w-8 h-8 text-[#EFB810]" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-lg font-medium text-gray-300 mb-2">¡Comenzá la conversación!</h3>
                <p class="text-gray-500 text-sm">Sé el primero en enviar un mensaje a la comunidad</p>
            </div>
        </div>

        <!-- Input del mensaje estilo Instagram -->
        <form @submit.prevent="handleSubmit"
            class="p-4 border-t border-gray-800 bg-[#1C1C1C]">
            <div class="flex items-end gap-3">
                <!-- Avatar del usuario actual -->
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5 flex-shrink-0">
                    <img :src="user.avatar_url || '/default-avatar.png'" alt="avatar"
                        class="w-full h-full rounded-full object-cover bg-[#121212]" />
                </div>

                <!-- Input container -->
                <div class="flex-1 flex items-end gap-2">
                    <div class="flex-1 bg-[#2C2C2C] border border-gray-700 rounded-2xl px-4 py-2 focus-within:border-[#EFB810] transition">
                        <textarea v-model="newMessage.content"
                            placeholder="Envía un mensaje..."
                            rows="1"
                            class="w-full bg-transparent text-white text-sm resize-none focus:outline-none placeholder-gray-500"
                            maxlength="300"
                            @keydown.enter.exact.prevent="handleSubmit"
                            @input="$event.target.style.height = 'auto'; $event.target.style.height = $event.target.scrollHeight + 'px'"></textarea>
                    </div>

                    <!-- Botón enviar -->
                    <button type="submit"
                        :disabled="!newMessage.content.trim()"
                        :class="newMessage.content.trim() ? 'bg-[#EFB810] hover:bg-yellow-400 text-black' : 'bg-gray-700 text-gray-500 cursor-not-allowed'"
                        class="w-8 h-8 rounded-full flex items-center justify-center transition flex-shrink-0">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Contador de caracteres -->
            <div v-if="newMessage.content.length > 250"
                class="text-right text-xs mt-2"
                :class="newMessage.content.length >= 300 ? 'text-red-400' : 'text-gray-500'">
                {{ newMessage.content.length }}/300
            </div>
        </form>
    </section>
</template>
