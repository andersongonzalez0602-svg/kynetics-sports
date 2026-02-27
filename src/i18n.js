import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        nba: 'NBA',
        login: 'Login',
        logout: 'Logout',
        admin: 'ADMIN',
      },
      auth: {
        welcomeBack: 'Welcome back',
        createAccount: 'Create account',
        loginSubtitle: 'Sign in to access your account',
        signupSubtitle: 'Join the Kynetics community',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        createAccountCta: 'Create Account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        emailLabel: 'Email',
        passwordLabel: 'Password',
      },
      hero: {
        badge: "TODAY'S TOP PICK",
        fallbackTitle: "Don't miss any game",
        description:
          'Predictions, stats, and matchups for every NBA game — powered by data analysis and brought to life with unique team mascots.',
        button: 'See Full Prediction',
        livePicks: 'Live picks available',
      },
      statsBar: {
        game: 'Game',
        games: 'Games',
        today: 'Today',
        ready: 'AI predictions ready — tap to explore',
        later: 'Check back later for upcoming matchups',
      },
      howItWorks: {
        tag: 'How It Works',
        title: 'From Data to Winning Decisions',
        body: 'We simplify complex sports analysis. No boring spreadsheets—just visual insights ready to use.',
        cta: 'Get Started',
        steps: [
          {
            title: 'Select Your Game',
            desc: 'Browse the NBA calendar and choose the matchup you want to analyze.',
          },
          {
            title: 'Analyze with AI',
            desc: 'Review the win probability calculated by our Kynetics Engine™.',
          },
          {
            title: 'Compare Metrics',
            desc: 'Visualize streaks, history, and community sentiment in real time.',
          },
        ],
      },
      cta: {
        title: 'Real-Time Data Analysis',
        body: 'Get instant insights into every NBA matchup',
        button: 'Watch Games',
      },
      mascots: {
        title: 'Meet the Mascots',
        intro:
          'Every team has a character. We designed unique mascots that capture the spirit and energy of each franchise. Collect them, compare them, and follow your favorites.',
        badges: {
          original: 'Original Designs',
          teams: '30 NBA Teams',
          daily: 'Updated Daily',
        },
        featuredTitle: "Today's Featured Teams",
        featuredBody: "These are today's highlighted matchups and their mascots.",
      },
      faq: {
        tag: 'Support & Help',
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our methodology.',
        items: [
          {
            q: 'How does the prediction model work?',
            a: 'Our Kynetics Engine™ analyzes over 10,000 data points per game including player performance, historical matchups, team momentum, and more to calculate win probabilities.',
          },
          {
            q: 'How accurate are the predictions?',
            a: 'Our AI maintains an average accuracy of 82% across all NBA predictions. Accuracy is measured daily and reported transparently on the homepage.',
          },
          {
            q: 'Is this a betting platform?',
            a: 'No. Kynetics Sports is for entertainment purposes only. We provide data-driven insights and predictions but do not facilitate any form of betting.',
          },
          {
            q: 'How often is data updated?',
            a: 'Game predictions are updated daily before each matchup. Live game statuses are updated in real-time during games.',
          },
          {
            q: 'Can I participate in community voting?',
            a: 'Yes! Anyone can vote on game outcomes. Community sentiment is displayed alongside our AI predictions for every matchup.',
          },
        ],
      },
      nba: {
        todayLabel: 'Today',
        headerDescription:
          'AI-powered predictions and original mascot designs for every NBA matchup.',
        gamesLabel: 'Games',
        backToToday: '← Back to Today',
        loading: 'Loading games...',
        noGamesTitle: 'No games for this date',
        noGamesBody: 'Try a different day or check back later.',
        goToToday: 'Go to Today',
        tabs: {
          all: 'All',
          live: 'Live',
          upcoming: 'Upcoming',
          featured: 'Featured',
        },
      },
      dashboard: {
        live: 'LIVE',
        final: 'FINAL',
        value: 'VALUE',
        vs: 'VS',
        aiPredictionLabel: 'AI Prediction',
        seeDetails: 'See Details →',
        community: 'Community',
        votes: 'votes',
        aiTitle: 'Kynetics AI Prediction',
        basedOnDataPoints: 'Based on {{count}} data points analyzed',
        basedOnDataPointsShort: '{{count}} data points',
        dataPoints: 'data points',
        currentStreak: 'Current Streak',
        headToHead: 'Head to Head',
        noData: 'No data',
        aiInsight: 'AI Insight',
        yourVote: 'Your Vote',
        communityVoteTitle: 'Community Vote — Who do you think wins?',
        homeLabel: 'HOME',
        awayLabel: 'AWAY',
        last5: 'Last 5 Games',
        streakShort: 'Streak',
        h2hShort: 'H2H',
      },
      footer: {
        platform: 'Platform',
        legal: 'Legal',
        contact: 'Contact',
        nbaGames: 'NBA Games',
        myStreak: 'My Streak',
        leaderboard: 'Leaderboard',
        responsibleGaming: 'Responsible Gaming',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
        disclaimer: 'Disclaimer',
        questions: 'Questions or feedback?',
        responseTime: 'Response within 24 hours',
        sendMessage: 'Send Message',
        tagline: 'NBA Predictions & Mascots',
        subTagline: 'The smarter way to follow the NBA.',
        copyright: '© 2026 Kynetics Sports. All Rights Reserved.',
        entertainmentNotice:
          'For entertainment purposes only. Mascot designs and content are proprietary and protected by copyright law.',
        langEn: 'EN',
        langEs: 'ES',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        nba: 'NBA',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        admin: 'ADMIN',
      },
      auth: {
        welcomeBack: 'Bienvenido de nuevo',
        createAccount: 'Crear cuenta',
        loginSubtitle: 'Inicia sesión para acceder a tu cuenta',
        signupSubtitle: 'Únete a la comunidad de Kynetics',
        signIn: 'Iniciar sesión',
        signUp: 'Registrarse',
        createAccountCta: 'Crear cuenta',
        noAccount: '¿No tienes una cuenta?',
        hasAccount: '¿Ya tienes una cuenta?',
        emailLabel: 'Correo electrónico',
        passwordLabel: 'Contraseña',
      },
      hero: {
        badge: 'PICK DESTACADO DE HOY',
        fallbackTitle: 'No te pierdas ningún juego',
        description:
          'Predicciones, estadísticas y enfrentamientos para cada juego de la NBA, impulsados por datos y acompañados de mascotas únicas por equipo.',
        button: 'Ver predicción completa',
        livePicks: 'Picks en vivo disponibles',
      },
      statsBar: {
        game: 'Juego',
        games: 'Juegos',
        today: 'Hoy',
        ready: 'Predicciones listas: toca para explorar',
        later: 'Vuelve más tarde para ver nuevos enfrentamientos',
      },
      howItWorks: {
        tag: 'Cómo funciona',
        title: 'De los datos a las decisiones ganadoras',
        body: 'Simplificamos el análisis deportivo complejo. Sin hojas de cálculo aburridas, solo insights visuales listos para usar.',
        cta: 'Comenzar',
        steps: [
          {
            title: 'Elige tu juego',
            desc: 'Explora el calendario de la NBA y selecciona el enfrentamiento que quieres analizar.',
          },
          {
            title: 'Analiza con IA',
            desc: 'Revisa la probabilidad de victoria calculada por nuestro Kynetics Engine™.',
          },
          {
            title: 'Compara métricas',
            desc: 'Visualiza rachas, historial y sentimiento de la comunidad en tiempo real.',
          },
        ],
      },
      cta: {
        title: 'Análisis en tiempo real',
        body: 'Obtén insights instantáneos de cada enfrentamiento de la NBA',
        button: 'Ver juegos',
      },
      mascots: {
        title: 'Conoce a las mascotas',
        intro:
          'Cada equipo tiene una personalidad. Diseñamos mascotas únicas que capturan la energía y el espíritu de cada franquicia. Colecciónalas, compáralas y sigue a tus favoritas.',
        badges: {
          original: 'Diseños originales',
          teams: '30 equipos NBA',
          daily: 'Actualizado a diario',
        },
        featuredTitle: 'Equipos destacados de hoy',
        featuredBody: 'Estos son los enfrentamientos destacados de hoy y sus mascotas.',
      },
      faq: {
        tag: 'Soporte y ayuda',
        title: 'Preguntas frecuentes',
        subtitle: 'Todo lo que necesitas saber sobre nuestra metodología.',
        items: [
          {
            q: '¿Cómo funciona el modelo de predicción?',
            a: 'Nuestro Kynetics Engine™ analiza más de 10.000 datos por juego, incluyendo rendimiento de jugadores, historial de enfrentamientos, momento de cada equipo y más para calcular probabilidades de victoria.',
          },
          {
            q: '¿Qué tan precisas son las predicciones?',
            a: 'Nuestra IA mantiene una precisión promedio del 82 % en todas las predicciones de la NBA. La precisión se mide diariamente y se reporta de forma transparente en la página de inicio.',
          },
          {
            q: '¿Es una plataforma de apuestas?',
            a: 'No. Kynetics Sports es solo para fines de entretenimiento. Ofrecemos análisis y predicciones basadas en datos, pero no facilitamos ningún tipo de apuesta.',
          },
          {
            q: '¿Con qué frecuencia se actualizan los datos?',
            a: 'Las predicciones se actualizan a diario antes de cada juego. El estado en vivo se actualiza en tiempo real durante los partidos.',
          },
          {
            q: '¿Puedo participar en la votación de la comunidad?',
            a: 'Sí. Cualquiera puede votar el resultado de los juegos. El sentimiento de la comunidad se muestra junto a nuestras predicciones de IA.',
          },
        ],
      },
      nba: {
        todayLabel: 'Hoy',
        headerDescription:
          'Predicciones con IA y diseños originales de mascotas para cada juego de la NBA.',
        gamesLabel: 'Juegos',
        backToToday: '← Volver a hoy',
        loading: 'Cargando juegos...',
        noGamesTitle: 'No hay juegos para esta fecha',
        noGamesBody: 'Prueba con otro día o vuelve más tarde.',
        goToToday: 'Ir a hoy',
        tabs: {
          all: 'Todos',
          live: 'En vivo',
          upcoming: 'Próximos',
          featured: 'Destacados',
        },
      },
      dashboard: {
        live: 'EN VIVO',
        final: 'FINAL',
        value: 'VALOR',
        vs: 'VS',
        aiPredictionLabel: 'Predicción de IA',
        seeDetails: 'Ver detalles →',
        community: 'Comunidad',
        votes: 'votos',
        aiTitle: 'Predicción IA de Kynetics',
        basedOnDataPoints: 'Basado en {{count}} puntos de datos analizados',
        basedOnDataPointsShort: '{{count}} puntos de datos',
        dataPoints: 'puntos de datos',
        currentStreak: 'Racha actual',
        headToHead: 'Enfrentamientos directos',
        noData: 'Sin datos',
        aiInsight: 'Insight de IA',
        yourVote: 'Tu voto',
        communityVoteTitle: 'Voto de la comunidad — ¿Quién crees que gana?',
        homeLabel: 'LOCAL',
        awayLabel: 'VISITANTE',
        last5: 'Últimos 5 juegos',
        streakShort: 'Racha',
        h2hShort: 'H2H',
      },
      footer: {
        platform: 'Plataforma',
        legal: 'Legal',
        contact: 'Contacto',
        nbaGames: 'Juegos NBA',
        myStreak: 'Mi racha',
        leaderboard: 'Tabla de posiciones',
        responsibleGaming: 'Juego responsable',
        privacy: 'Política de privacidad',
        terms: 'Términos de servicio',
        cookies: 'Política de cookies',
        disclaimer: 'Aviso legal',
        questions: '¿Preguntas o comentarios?',
        responseTime: 'Respuesta en menos de 24 horas',
        sendMessage: 'Enviar mensaje',
        tagline: 'Predicciones NBA y mascotas',
        subTagline: 'La forma más inteligente de seguir la NBA.',
        copyright: '© 2026 Kynetics Sports. Todos los derechos reservados.',
        entertainmentNotice:
          'Solo para fines de entretenimiento. Los diseños de mascotas y el contenido son propiedad exclusiva y están protegidos por derechos de autor.',
        langEn: 'EN',
        langEs: 'ES',
      },
    },
  },
}

const detectInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem('lang')
  if (saved === 'en' || saved === 'es') return saved

  const navLang = (navigator.language || 'en').toLowerCase()
  if (navLang.startsWith('es')) return 'es'
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

