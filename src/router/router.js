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


let user = {
    id: null,
    email: null,
}
subscribeToAuthStateChanges(newUserState => user = newUserState);


router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && user.id === null) {
        return '/login';
    }
});

export default router;