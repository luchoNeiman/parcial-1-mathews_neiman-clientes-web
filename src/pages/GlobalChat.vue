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
                    this.user.avatar_url || null
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
    <section
        class="relative flex flex-col h-[calc(100vh-80px)] bg-gradient-to-br from-[#181824] via-[#23233a] to-[#121212]">
        <h1 class="text-center text-3xl font-bold text-[#EFB810] py-6 drop-shadow-lg">Chat Global</h1>

        <!-- Contenedor del chat -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-2 pb-36 flex flex-col gap-2"
            style="scroll-behavior: smooth;">
            <ol class="flex flex-col gap-3">
                <li v-for="message in messages" :key="message.id" class="flex items-end"
                    :class="{ 'justify-end': message.sender_id === user.id, 'justify-start': message.sender_id !== user.id }">

                    <!-- Avatar del otro usuario -->
                    <div v-if="message.sender_id !== user.id" class="mr-2">
                        <img :src="message.avatar_url || '/default-avatar.png'" alt="avatar"
                            class="w-8 h-8 rounded-full shadow-lg border border-gray-700 object-cover" />
                    </div>

                    <!-- Burbuja de mensaje -->
                    <div :class="[
                        'max-w-[70%] p-3 rounded-2xl shadow-md',
                        message.sender_id === user.id
                            ? 'bg-gradient-to-br from-blue-600 to-blue-400 text-white self-end'
                            : 'bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 self-start',
                    ]">
                        <div class="flex items-center gap-2 mb-1">
                            <RouterLink :to="getLinkForUser(message.sender_id)"
                                class="font-semibold text-xs text-blue-700 hover:underline">
                                {{ message.username || message.email.split('@')[0] }}
                            </RouterLink>
                            <span class="text-gray-400 text-xs">
                                · {{ new Date(message.created_at).toLocaleTimeString() }}
                            </span>
                        </div>
                        <div class="break-words text-base">{{ message.content }}</div>
                    </div>

                    <!-- Avatar propio -->
                    <div v-if="message.sender_id === user.id" class="ml-2">
                        <img :src="user.avatar_url || '/default-avatar.png'" alt="avatar"
                            class="w-8 h-8 rounded-full shadow-lg border border-blue-400 object-cover" />
                    </div>
                </li>
            </ol>
        </div>

        <!-- Input del mensaje -->
        <form @submit.prevent="handleSubmit"
            class="absolute left-0 right-0 bottom-0 bg-[#23233a]/90 backdrop-blur-lg px-4 py-4 flex items-center gap-3 shadow-2xl"
            style="z-index: 10;">
            <img :src="user.avatar_url || '/default-avatar.png'" alt="avatar"
                class="w-8 h-8 rounded-full border border-blue-400 object-cover hidden md:block" />
            <textarea v-model="newMessage.content" placeholder="Escribí tu mensaje..." rows="1"
                class="flex-1 resize-none p-3 border border-gray-600 rounded-2xl bg-[#181824] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                maxlength="300"></textarea>
            <button type="submit"
                class="px-5 py-2 bg-gradient-to-br from-[#EFB810] to-yellow-400 hover:from-yellow-400 hover:to-[#EFB810] transition rounded-2xl text-gray-900 font-bold shadow-lg">
                <i class="fa fa-paper-plane"></i>
            </button>
        </form>
    </section>
</template>
