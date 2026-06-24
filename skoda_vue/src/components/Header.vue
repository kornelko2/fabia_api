<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          <img src="/fabia-car.svg" alt="Škoda Fabia" class="logo">
          <div class="brand-text">
            <router-link to="/" class="brand-title">Škoda Fabia Converter</router-link>
            <span class="tagline">{{ $t('header.tagline') }}</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="toggleLanguage" class="language-btn" :title="currentLanguage.name">
            {{ currentLanguage.flag }} {{ currentLanguage.code.toUpperCase() }}
          </button>
          
          <button @click="toggleMenu" class="menu-btn" aria-label="Menu">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <nav class="mobile-nav" v-if="showMenu">
        <div class="nav-section">
          <h3>{{ $t('header.languages') }}</h3>
          <div class="language-grid">
            <button 
              v-for="lang in languages" 
              :key="lang.code"
              @click="selectLanguage(lang)"
              class="lang-option"
              :class="{ active: currentLanguage.code === lang.code }"
            >
              {{ lang.flag }} {{ lang.name }}
            </button>
          </div>
        </div>
        
        <div class="nav-section">
          <h3>{{ $t('header.tools') }}</h3>
          <button @click="openEmbedDialog" class="nav-action">
            <AppIcon :icon="Link2" /> {{ $t('header.embedCode') }}
          </button>
          <button @click="shareApp" class="nav-action">
            <AppIcon :icon="Share2" /> {{ $t('header.shareApp') }}
          </button>
        </div>
      </nav>
    </div>
    
    <!-- PWA Install Prompt -->
    <div v-if="showInstallPrompt" class="pwa-prompt">
      <div class="pwa-text">
        <strong>{{ $t('header.installTitle') }}</strong>
        <p>{{ $t('header.installText') }}</p>
      </div>
      <div class="pwa-actions">
        <button class="pwa-btn secondary" @click="dismissInstall">{{ $t('header.later') }}</button>
        <button class="pwa-btn primary" @click="installPWA">{{ $t('header.install') }}</button>
      </div>
    </div>

    <!-- Embed Code dialog -->
    <div v-if="showEmbedDialog" class="embed-overlay" @click="showEmbedDialog = false">
      <div class="embed-dialog" @click.stop>
        <div class="embed-dialog-header">
          <h3><AppIcon :icon="Link2" :size="18" /> {{ $t('header.embedTitle') }}</h3>
          <button @click="showEmbedDialog = false" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>
        <p>{{ $t('header.embedDesc') }}</p>
        <textarea class="embed-code" rows="5" readonly :value="embedCode" @focus="$event.target.select()"></textarea>
        <div class="embed-actions">
          <button @click="copyEmbedCode" class="nav-action"><AppIcon :icon="Copy" /> {{ $t('header.copyCode') }}</button>
          <button @click="showEmbedDialog = false" class="nav-action secondary">{{ $t('common.close') }}</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </header>
</template>

<script>
import { Link2, Share2, Copy, X } from '@lucide/vue'
import AppIcon from './AppIcon.vue'

export default {
  name: 'AppHeader',
  components: { AppIcon },
  setup() {
    return { Link2, Share2, Copy, X }
  },
  props: {
    currentLanguage: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showMenu: false,
      showInstallPrompt: false,
      showEmbedDialog: false,
      embedCode: '',
      toastMessage: '',
      toastTimer: null,
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
    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt = true;
    });
    
    // Hide install prompt if already installed
    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt = false;
      this.deferredPrompt = null;
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showMenu = false;
      }
    });
  },
  methods: {
    toggleLanguage() {
      // Quick toggle between current and English
      const nextLang = this.currentLanguage.code === 'en' 
        ? this.languages.find(l => l.code === 'cs')
        : this.languages.find(l => l.code === 'en');
      this.selectLanguage(nextLang);
    },
    
    selectLanguage(language) {
      this.$emit('language-changed', language);
      this.showMenu = false;
    },
    
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    
    async installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          console.log('PWA installed');
        }
        
        this.deferredPrompt = null;
        this.showInstallPrompt = false;
      }
    },
    
    dismissInstall() {
      this.showInstallPrompt = false;
      // Remember dismissal for 24 hours
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    },
    
    openEmbedDialog() {
      const url = window.location.origin + window.location.pathname;
      this.embedCode =
        `<!-- Škoda Fabia Converter -->\n` +
        `<iframe src="${url}" title="Škoda Fabia Converter" ` +
        `width="420" height="640" loading="lazy" ` +
        `style="border:1px solid #00A651;border-radius:8px;max-width:100%;"></iframe>`;
      this.showEmbedDialog = true;
      this.showMenu = false;
    },

    async copyEmbedCode() {
      const ok = await this.copyText(this.embedCode);
      this.showToast(ok ? this.$t('header.toastEmbedCopied') : this.$t('header.toastCopyFailed'));
      if (ok) this.showEmbedDialog = false;
    },

    async copyText(text) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (err) {
        console.error('Clipboard write failed:', err);
      }
      // Legacy fallback for non-secure contexts / older browsers
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (err) {
        console.error('Legacy copy failed:', err);
        return false;
      }
    },

    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toastMessage = ''; }, 2500);
    },

    async shareApp() {
      const shareData = {
        title: 'Škoda Fabia Converter',
        text: 'Automotive unit conversion tool for Škoda Fabia specs',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // AbortError = user dismissed the share sheet; anything else falls back to copy
          if (err && err.name !== 'AbortError') {
            const ok = await this.copyText(shareData.url);
            this.showToast(ok ? this.$t('header.toastLinkCopied') : this.$t('header.toastShareFailed'));
          }
        }
      } else {
        // Fallback: copy to clipboard
        const ok = await this.copyText(shareData.url);
        this.showToast(ok ? this.$t('header.toastLinkCopied') : this.$t('header.toastShareFailed'));
      }
      this.showMenu = false;
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  min-height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  height: 32px;
  width: auto;
}

.brand-text .brand-title {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--skoda-green);
  margin: 0;
  text-decoration: none;
}

.tagline {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-btn, .menu-btn {
  background: var(--skoda-green-light);
  color: var(--skoda-green);
  border: 1px solid var(--skoda-green);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: auto;
  white-space: nowrap;
}

.menu-btn {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 0;
  animation: slideDown 0.2s ease;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.lang-option {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: left;
  transition: all 0.2s ease;
}

.lang-option:hover {
  border-color: var(--skoda-green);
  background: var(--skoda-green-light);
}

.lang-option.active {
  background: var(--skoda-green);
  color: white;
  border-color: var(--skoda-green);
}

.nav-action {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  text-align: left;
  font-size: 0.875rem;
  width: 100%;
}

.nav-action:hover {
  background: var(--skoda-green-light);
  border-color: var(--skoda-green);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .brand-text .brand-title {
    font-size: 1.25rem;
  }

  .tagline {
    font-size: 0.75rem;
  }

  .language-btn {
    font-size: 0.75rem;
    padding: 0.375rem 0.5rem;
  }

  .header-content {
    padding: 0.75rem 0;
    min-height: 56px;
  }
}

/* Embed dialog */
.embed-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.embed-dialog {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.embed-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.embed-dialog-header h3 {
  margin: 0;
  color: var(--skoda-green);
  font-size: 1.1rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.embed-code {
  width: 100%;
  font-family: monospace;
  font-size: 0.8rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  margin: 0.5rem 0 1rem;
  box-sizing: border-box;
}

.embed-actions {
  display: flex;
  gap: 0.5rem;
}

.embed-actions .nav-action {
  margin-bottom: 0;
  text-align: center;
  background: var(--skoda-green);
  color: white;
  border-color: var(--skoda-green);
}

.embed-actions .nav-action.secondary {
  background: white;
  color: #333;
  border-color: #ddd;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 1100;
  animation: slideDown 0.2s ease;
}
</style>