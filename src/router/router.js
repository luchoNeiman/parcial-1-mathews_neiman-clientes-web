// Este es nuestro archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthStateChanges } from "../services/auth";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import GlobalChat from "../pages/GlobalChat.vue";
// import MiPerfil from "../pages/MiPerfil.vue";
// import EditarMiPerfil from "../pages/EditarMiPerfil.vue";
// import PerfilUsuario from "../pages/PerfilUsuario.vue";
import Movies from "../pages/Movies.vue";
import MovieDetail from "../pages/MovieDetail.vue";
import Soundtracks from "../pages/Soundtracks.vue";
// import NotFound from "../pages/NotFound.vue";


const routes = [
    { path: '/',                name: 'Home',               component: Home },    
    { path: '/login',           name: 'Login',              component: Login, },
    { path: '/register',        name: 'Register',           component: Register, },
    { path: '/chat',            name: 'GlobalChat',         component: GlobalChat,           meta: { requiresAuth: true, }, },
    { path: '/movies',          name: 'Movies',             component: Movies, },
    { path: '/movies/:id',      name: 'MovieDetail',        component: MovieDetail, },
    { path: '/soundtracks',     name: 'Soundtracks',        component: Soundtracks, },
    // { path: '/mi-perfil',            component: MiPerfil,              meta: { requiresAuth: true, }, },
    // { path: '/mi-perfil/editar',     component: EditarMiPerfil,        meta: { requiresAuth: true, }, },
    // { path: '/usuario/:id',          component: PerfilUsuario,         meta: { requiresAuth: true, }, },
];

// Creamos propiamente el router.
// A createRouter le pasamos un objeto de 2 propiedades:
// 1. routes. El array de rutas.
// 2. history. El modo de manejo del historial de navegación.
//  Se genera con las funciones createWebHistory o createWebHashHistory.
const router = createRouter({
    // routes: routes,
    history: createWebHistory(),
    routes,
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
    if (to.meta.requiresAuth && user.id === null) {
        return '/login';
    }

    // console.group('🚦 Routes');
    // console.log('Navegando desde la ruta: ', from);
    // console.log('Navegando a la ruta: ', to);
    // console.groupEnd();
});

export default router;