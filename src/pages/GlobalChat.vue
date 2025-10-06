<script>
import { subscribeToAuthStateChanges } from '../services/auth'
import {getMessages, sendMessage, subscribeToMessages} from '../services/global-chat'

let unsubscribeFromAuth = () => { }
let unsubscribeFromChat = () => { }

export default {
    name: 'GlobalChat',
    components: {},

    data() {
        return {
            messages: [],
            newMessage: {
                content: '',
            },
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },

    methods: {
        async handleSubmit() {
            try {
                if (!this.newMessage.content.trim()) return

                await sendMessage({
                    sender_id: this.user.id,
                    email: this.user.email,
                    content: this.newMessage.content,
                })
            } catch (error) {
                console.error('[handleSubmit] Error enviando mensaje:', error)
            }

            this.newMessage.content = ''
        },

        getLinkForUser(senderId) {
            return this.user.id !== senderId ? `/usuario/${senderId}` : '/mi-perfil'
        },
    },

    async mounted() {
        // Suscripción a cambios en el estado de autenticación
        unsubscribeFromAuth = subscribeToAuthStateChanges(
            newUserState => this.user = newUserState
        )

        // Suscripción a mensajes en tiempo real
        unsubscribeFromChat = subscribeToMessages(async newMessage => {
            this.messages.push(newMessage)
            await this.$nextTick()
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
        })

        // Cargar mensajes previos
        this.messages = await getMessages()

        // Esperar render y scrollear
        await this.$nextTick()
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
    },

    unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
    },
}
</script>

<template>
    <section class="p-6 mt-20">
        <h1 class="text-center">Chat Global</h1>

        <div class="flex flex-col md:flex-row gap-6">
            <!-- Contenedor del chat -->
            <section class="overflow-y-auto flex-1 h-[70vh] p-4 border border-gray-700 rounded bg-[#0f0f0f] text-white"
                ref="chatContainer">
                <h2 class="sr-only">Mensajes</h2>
                <ol class="flex flex-col gap-4">
                    <li v-for="message in messages" :key="message.id" class="p-3 rounded bg-gray-800">
                        <div class="mb-1 text-sm">
                            <RouterLink :to="getLinkForUser(message.sender_id)"
                                class="font-semibold text-blue-400 hover:underline">
                                {{ message.email }}
                            </RouterLink>
                            <span class="text-gray-400"> dijo:</span>
                        </div>
                        <div class="mb-1 text-gray-100">{{ message.content }}</div>
                        <div class="text-xs text-gray-500">{{ message.created_at }}</div>
                    </li>
                </ol>
            </section>

            <!-- Formulario -->
            <section class="md:w-1/3 bg-[#1a1a1a] p-4 rounded border border-gray-700">
                <h2 class="mb-4 text-xl font-semibold text-white">Enviar mensaje</h2>
                <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                    <div>
                        <span class="block mb-1 text-gray-300">Email</span>
                        <span class="text-gray-400 text-sm">{{ user.email || 'No logueado' }}</span>
                    </div>

                    <div>
                        <label for="content" class="block mb-1 text-gray-300">Mensaje</label>
                        <textarea id="content"
                            class="w-full p-2 border border-gray-600 rounded bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            v-model="newMessage.content" placeholder="Escribí algo..."></textarea>
                    </div>

                    <button type="submit"
                        class="self-start px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white">
                        Enviar
                    </button>
                </form>

            </section>
        </div>
    </section>
</template>
