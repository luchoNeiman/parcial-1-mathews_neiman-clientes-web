# Underground Cinema

**Una red social para cinéfilos**

Underground Cinema es una red social dedicada a los amantes del cine independiente, los clásicos de culto y las joyas ocultas del séptimo arte. La plataforma permite a los usuarios compartir sus películas favoritas, crear publicaciones con imágenes, dejar comentarios, reaccionar con "me gusta" y participar de un chat global con la comunidad cinéfila.

## ¿Qué hicimos?

Creamos una app para los cinefilos amantes del arte que no se encuentra en medios mainstream. La idea era crear un lugar donde podés:

- **Subir fotos de las películas que te gustaron** (como postear en Instagram pero con posters de películas)
- **Comentar y dar like** a las recomendaciones de otros usuarios
- **Chatear con toda la comunidad** sobre cine en tiempo real
- **Tener tu perfil personalizado** con tu avatar y tus películas favoritas

## Tecnología

### Frontend - Vue.js 3
**Vue**
Más allá de ser lo que vimos en clase, el sistema de reactividad de vue es muy bueno para manejar estados complejos como el chat en tiempo real.

### Backend/Base de Datos - Supabase
**¿Por qué Supabase?**
Supabase nos da:
- Base de datos PostgreSQL 
- Storage para las imágenes
- Tiempo real 
- Es open source y gratis 

### Estilos + Flowbite
Flowbite nos dió componentes pre-hechos que se ven modernos y responsivos.

### Build Tool - Vite
**¿Por qué Vite?**
Más rápido que Webpack. El  reload es instantáneo y no tenés que esperar 10 segundos cada vez que cambias algo.

## Decisiones de Diseño

### Tema Oscuro + Colores Dorados
Quisimos que se sienta como estar en un cine: fondo oscuro con tonos dorados que nos llevan a los premios Oscar y la elegancia del cine clásico.

### Layout inspirado en Instagram
No inventamos la rueda. Instagram tiene la UX más estudiada del mundo, así que tomamos lo mejor:
- Feed vertical de posts
- Sidebar con sugerencias
- Navegación simple y familiar


## Funcionalidades Principales

### Página de Inicio
- **Video de fondo** para dar impacto visual
- **Feed de películas recientes** de la comunidad
- **Sugerencias de perfiles** para explorar
- **Call-to-action**  para registrarse

### Gestión de Películas
- **Subir películas** con poster, título y descripción
- **Ver detalle completo** con comentarios y likes
- **Editar/eliminar** tus propias publicaciones
- **Sistema de likes** en tiempo real

###  Perfiles de Usuario
- **Perfil personalizable** con avatar y bio
- **Grid de películas**
- **Estadísticas reales** de publicaciones, seguidores y seguidos
- **Sistema de seguimiento** entre usuarios
- **Vista pública** para otros usuarios

### Chat Global
- **Mensajería en tiempo real** usando Supabase realtime
- **Avatares con gradientes** para darle vida
- **Timestamps** y navegación a perfiles


### Autenticación
- **Registro/Login** con email
- **Protección de rutas** para contenido privado
- **Estados de carga** y error handling

### Sistema de Seguimiento de Usuarios
Implementamos un sistema completo de seguimiento entre usuarios similar a Instagram. Creamos una tabla `follows` en Supabase que almacena las relaciones follower/following, agregamos Row Level Security para protección, y desarrollamos toda la lógica frontend para seguir/dejar de seguir usuarios. Ahora los usuarios pueden seguirse entre sí y ver las estadísticas reales de seguidores y seguidos en sus perfiles, reemplazando los números hardcodeados que teníamos antes.

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.vue      # Navegación principal
│   ├── MovieCard.vue   # Card de película para el feed
│   └── LikeButton.vue  # Botón de like interactivo
├── pages/               # Vistas principales
│   ├── Home.vue        # Página de inicio con feed
│   ├── Movies.vue      # Listado de todas las películas
│   ├── MovieDetail.vue # Detalle de película individual
│   ├── MyProfile.vue   # Perfil del usuario logueado
│   ├── UserProfile.vue # Perfil de otros usuarios
│   ├── GlobalChat.vue  # Chat de la comunidad
│   └── Auth/           # Páginas de autenticación
├── services/            # Lógica de negocio
│   ├── auth.js         # Manejo de autenticación
│   ├── supabase.js     # Configuración de Supabase
│   ├── follows.js      # Sistema de seguimiento entre usuarios
│   ├── user-profiles.js # Gestión de perfiles de usuario
│   └── global-chat.js  # Lógica del chat en tiempo real
└── router/             # Configuración de rutas
```

## Cómo correr el proyecto

### Prerequisitos
- Node.js 16+
- npm o yarn
- Cuenta en Supabase

### Instalación

1. **Clonar el repo**
```bash
git clone https://github.com/luchoNeiman/parcial-1-mathews_neiman-clientes-web.git
cd parcial-1-mathews_neiman-clientes-web
```

2. **Instalar dependencias**
```bash
npm install
```
3. **Configurar Supabase** 
Las credenciales de Supabase ya están configuradas en el proyecto. Si querés usar tu propia instancia de Supabase, podés crear un archivo `.env` con:
```env
VITE_SUPABASE_URL=. 'https://msaisnrsgrlbyhxiaowt.supabase.co'
VITE_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zYWlzbnJzZ3JsYnloeGlhb3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTk4MTQsImV4cCI6MjA3NTI3NTgxNH0.AIYruceFywIgOvHD9_MOXIMIw10IrjzPVGMveaUSRmY
```

4. **Correr en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

##  Base de Datos (Supabase)

### Tablas principales:
- `user_profiles` - Información de usuarios
- `movies` - Publicaciones de películas
- `comments` - Comentarios en las películas
- `likes` - Sistema de reacciones
- `follows` - Sistema de seguimiento entre usuarios
- `messages` - Chat global

### Storage:
- `avatars` - Fotos de perfil de usuarios
- `posters` - Imágenes de las películas

##  Features que nos gustaria  implementar a futuro
- Notificaciones push
- Búsqueda avanzada de películas
- Filtros por género/año
- Sistema de recomendaciones
- Chat privado entre usuarios
- Modo oscuro/claro toggle
- Compartir en redes sociales

##  Equipo

Proyecto desarrollado para la materia **Clientes Web Mobile**  por  **Luciano Neiman** y **Evelyn Mathews**

