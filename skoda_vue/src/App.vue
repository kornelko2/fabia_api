
<template>
  <div id="app">
    <Header
      :current-language="currentLanguage"
      @language-changed="handleLanguageChange"
      @install-app="handleInstallApp"
    />

    <router-view />

    <Footer
      @use-example="handleUseExample"
      @install-app="handleInstallApp"
    />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      currentLanguage: { code: 'en', name: 'English', flag: '🇬🇧' },
      deferredPrompt: null,
      languages: [
        { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
        { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
        { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
      ]
    }
  },
  mounted() {
    // Sync the UI with the active i18n locale (initialised from storage/browser)
    const activeLocale = this.$i18n.locale;
    const language = this.languages.find(l => l.code === activeLocale);
    if (language) {
      this.currentLanguage = language;
    }

    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Register the service worker (client-only; dynamic import keeps the
    // SSG/SSR build from resolving the PWA virtual module on the server).
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        this.$swUpdate = registerSW({
          immediate: true,
          onRegistered: (r) => console.log('SW registered:', r),
          onRegisterError: (e) => console.log('SW registration failed:', e)
        });
      });
    }
  },
  methods: {
    handleLanguageChange(language) {
      this.currentLanguage = language;
      // Switch the whole UI language and persist the choice
      this.$i18n.locale = language.code;
      localStorage.setItem('preferred-language', language.code);
    },
    
    handleUseExample(example) {
      // Drive the converter via the deep-link query so it works from any page
      // (Home or a landing page). HomeView's ConversionForm reads ?q= and
      // auto-converts; this keeps a single, shareable mechanism.
      this.$router.push({ path: '/', query: { q: example } });
    },
    
    async handleInstallApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          console.log('PWA installed successfully');
        }
        
        this.deferredPrompt = null;
      }
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
}

/* PWA specific styles */
@media (display-mode: standalone) {
  #app {
    /* Additional padding for standalone mode */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Dark mode support (future enhancement) */
@media (prefers-color-scheme: dark) {
  /* Dark theme styles can be added here */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card {
    border-width: 2px;
  }
  
  button {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Print styles */
@media print {
  .header,
  .footer {
    display: none;
  }
  
  .main-content {
    padding: 0;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #000;
  }
}
</style>

