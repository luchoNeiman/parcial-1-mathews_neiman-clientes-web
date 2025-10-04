// Este es nuestro archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthStateChanges } from "../services/auth";
import Home from "../pages/Home.vue";
import ChatGlobal from "../pages/ChatGlobal.vue";
import Login from "../pages/Login.vue";
import Registro from "../pages/Registro.vue";
import MiPerfil from "../pages/MiPerfil.vue";
import EditarMiPerfil from "../pages/EditarMiPerfil.vue";
import PerfilUsuario from "../pages/PerfilUsuario.vue";
import Registro from "../pages/Registro.vue";

// Definimos nuestro array de rutas.
// Cada ruta debe ser un objeto que tenga al menos 2 propiedades:
// 1. path. La URL a partir de la raíz de mi sitio.
// 2. component. El componente que queremos renderizar para esa ruta.
// Puede recibir otras propiedades:
// 3. meta: Es un objeto que nos permite guardar metadata de la ruta. Esto es, valores arbitrarios que 
//  queramos asociar con ella.
const routes = [
    { path: '/',                                    component: Home, }, 
    { path: '/ingresar',                            component: Login, },   //
    { path: '/crear-cuenta',                        component: Registro, },
    { path: '/chat',                                component: ChatGlobal,       meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',                           component: MiPerfil,         meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',                    component: EditarMiPerfil,   meta: { requiresAuth: true, }, },
    { path: '/usuario/:id',                         component: PerfilUsuario,    meta: { requiresAuth: true, }, },
];

// Creamos propiamente el router.
// A createRouter le pasamos un objeto de 2 propiedades:
// 1. routes. El array de rutas.
// 2. history. El modo de manejo del historial de navegación.
//  Se genera con las funciones createWebHistory o createWebHashHistory.
const router = createRouter({
    // routes: routes,
    routes,
    history: createWebHistory(),
});

// Protección de rutas para usuarios autenticados.
// Primero, necesitamos obtener los datos del usuario autenticado.
let user = {
    id: null,
    email: null,
}
subscribeToAuthStateChanges(newUserState => user = newUserState);

// Ahora vamos a utilizar el "guard global" del Router: beforeEach
// Un "navigation guard" es una función que puede decidir si permite que ocurra una navegación,
// si lo prohibe (retornando false) o si redirecciona a otra ruta (retornando una nueva URL o ruta).
// Esta función va a recibir 2 parámetros:
// 1. RouteNormalized. La ruta a la que se está navegando.
// 2. RouteNormalized. La ruta de la cual provenimos.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return '/ingresar';
    }

    // console.group('🚦 Routes');
    // console.log('Navegando desde la ruta: ', from);
    // console.log('Navegando a la ruta: ', to);
    // console.groupEnd();
});

export default router;