// Este es nuestro archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthStateChanges } from "../services/auth";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import UserProfile from "../pages/UserProfile.vue";
import Movies from "../pages/Movies.vue";
import MovieDetail from "../pages/MovieDetail.vue";
import CreateMoviePost from "../pages/CreateMoviePost.vue";
import EditMyMovie from "../pages/EditMyMovie.vue";

const routes = [
    { path: '/',                        name: 'Home',                       component: Home },    
    { path: '/login',                   name: 'Login',                      component: Login, },
    { path: '/register',                name: 'Register',                   component: Register, },
    { path: '/mi-perfil',               name: 'MyProfile',                  component: MyProfile,             meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',        name: 'MyProfileEdit',              component: MyProfileEdit,         meta: { requiresAuth: true, }, },
    { path: '/usuario/:id',             name: 'UserProfile',                component: UserProfile,           meta: { requiresAuth: true, }, },
    { path: '/chat',                    name: 'GlobalChat',                 component: GlobalChat,            meta: { requiresAuth: true, }, },
    { path: '/movies',                  name: 'Movies',                     component: Movies, },
    { path: '/movies/:id',              name: 'MovieDetail',                component: MovieDetail, },
    { path: '/movies/crear',            name: 'CreateMoviePost',            component: CreateMoviePost,       meta: { requiresAuth: true, }, },
    { path: '/movies/editar/:id',       name: 'EditMyMovie',                component: EditMyMovie,           meta: { requiresAuth: true, }, },
];


const router = createRouter({
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
});

export default router;