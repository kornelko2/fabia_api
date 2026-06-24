<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="footer-brand">
            <h3>{{ $t('footer.brandTitle') }}</h3>
            <p>{{ $t('footer.brandDesc') }}</p>
          </div>
          
          <div class="footer-stats" v-if="stats">
            <div class="stats-header">
              <span class="live-indicator" v-if="usingRealData"><AppIcon :icon="Radio" :size="14" /> {{ $t('footer.live') }}</span>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">{{ stats.conversions.toLocaleString() }}</span>
                <span class="stat-label">{{ $t('footer.conversions') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ stats.languages }}</span>
                <span class="stat-label">{{ $t('footer.languages') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ stats.countries }}</span>
                <span class="stat-label">{{ $t('footer.countries') }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="footer-section">
          <h4>{{ $t('footer.quickExamples') }}</h4>
          <div class="quick-links">
            <button 
              v-for="example in quickExamples" 
              :key="example"
              @click="$emit('use-example', example)"
              class="quick-link"
            >
              {{ example }}
            </button>
          </div>
        </div>
        
        <!-- Tools & Features -->
        <div class="footer-section">
          <h4>{{ $t('footer.features') }}</h4>
          <ul class="feature-list">
            <li><AppIcon :icon="Car" :size="16" /> {{ $t('footer.feature1') }}</li>
            <li><AppIcon :icon="BrainCircuit" :size="16" /> {{ $t('footer.feature2') }}</li>
            <li><AppIcon :icon="Globe" :size="16" /> {{ $t('footer.feature3') }}</li>
            <li><AppIcon :icon="Smartphone" :size="16" /> {{ $t('footer.feature4') }}</li>
            <li><AppIcon :icon="Zap" :size="16" /> {{ $t('footer.feature5') }}</li>
            <li><AppIcon :icon="Target" :size="16" /> {{ $t('footer.feature6') }}</li>
          </ul>
        </div>
        
        <!-- Actions -->
        <div class="footer-section">
          <h4>{{ $t('footer.getStarted') }}</h4>
          <div class="footer-actions">
            <button @click="scrollToTop" class="footer-btn primary">
              <AppIcon :icon="ArrowUp" :size="16" /> {{ $t('footer.startConverting') }}
            </button>
            <button @click="installApp" class="footer-btn secondary" v-if="canInstall">
              <AppIcon :icon="Smartphone" :size="16" /> {{ $t('footer.installApp') }}
            </button>
            <button @click="shareApp" class="footer-btn secondary">
              <AppIcon :icon="Share2" :size="16" /> {{ $t('footer.shareApp') }}
            </button>
          </div>
          
          <div class="social-links" v-if="false">
            <a href="#" class="social-link" title="GitHub">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Support / Buy Me a Coffee -->
        <div class="footer-section">
          <h4>{{ $t('footer.support') }}</h4>
          <p style="color:#666; margin-bottom:0.75rem;">{{ $t('footer.supportDesc') }}</p>
          <div class="support-links">
            <a
              href="https://buymeacoffee.com/kornelko"
              target="_blank"
              rel="noopener"
              class="bmc-link"
              title="Buy me a coffee"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                class="bmc-img"
              />
            </a>
            <a
              href="https://github.com/kornelko2/fabia_api"
              target="_blank"
              rel="noopener"
              class="github-link"
              aria-label="View source on GitHub"
              title="View source on GitHub"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-info">
          <p>{{ $t('footer.copyright') }}</p>
          <div class="footer-meta">
            <span>{{ $t('footer.poweredByCf') }}</span>
            <span>•</span>
            <span>{{ $t('footer.poweredByOpenai') }}</span>
            <span>•</span>
            <span>{{ $t('footer.poweredByVue') }}</span>
          </div>
        </div>
        
        <div class="footer-links">
          <button @click="showAbout = true" class="footer-link">{{ $t('footer.about') }}</button>
          <button @click="showPrivacy = true" class="footer-link">{{ $t('footer.privacy') }}</button>
          <button @click="showHelp = true" class="footer-link">{{ $t('footer.help') }}</button>
        </div>
      </div>
      
      <!-- Performance Info -->
      <div class="performance-info" v-if="performance">
        <div class="perf-item">
          <span class="perf-label">{{ $t('footer.responseTime') }}</span>
          <span class="perf-value">{{ performance.responseTime }}ms</span>
        </div>
        <div class="perf-item">
          <span class="perf-label">{{ $t('footer.cacheHitRate') }}</span>
          <span class="perf-value">{{ performance.cacheHitRate }}%</span>
        </div>
        <div class="perf-item">
          <span class="perf-label">{{ $t('footer.apiStatus') }}</span>
          <span class="perf-value" :class="performance.apiStatus">{{ performance.apiStatus }}</span>
        </div>
      </div>
    </div>
    
    <!-- Modal Dialogs -->
    <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('about.title') }}</h3>
          <button @click="showAbout = false" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>
        <div class="modal-content">
          <p>{{ $t('about.intro') }}</p>

          <h4>{{ $t('about.systemTitle') }}</h4>
          <ul>
            <li>{{ $t('about.systemArea') }}</li>
            <li>{{ $t('about.systemWeight') }}</li>
            <li>{{ $t('about.systemLength') }}</li>
            <li>{{ $t('about.systemPower') }}</li>
            <li>{{ $t('about.systemVolume') }}</li>
          </ul>

          <h4>{{ $t('about.whyTitle') }}</h4>
          <ul>
            <li>{{ $t('about.whyRelatable') }}</li>
            <li>{{ $t('about.whyFun') }}</li>
            <li>{{ $t('about.whyUniversal') }}</li>
            <li>{{ $t('about.whyPractical') }}</li>
          </ul>

          <h4>{{ $t('about.featuresTitle') }}</h4>
          <ul>
            <li>{{ $t('about.featureAi') }}</li>
            <li>{{ $t('about.featureMultilingual') }}</li>
            <li>{{ $t('about.featureFast') }}</li>
            <li>{{ $t('about.featureMobile') }}</li>
            <li>{{ $t('about.featureEmbed') }}</li>
          </ul>

          <h4>{{ $t('about.techTitle') }}</h4>
          <ul>
            <li>{{ $t('about.techFrontend') }}</li>
            <li>{{ $t('about.techBackend') }}</li>
            <li>{{ $t('about.techDatabase') }}</li>
            <li>{{ $t('about.techAi') }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="showPrivacy" class="modal-overlay" @click="showPrivacy = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('privacy.title') }}</h3>
          <button @click="showPrivacy = false" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>
        <div class="modal-content">
          <h4>{{ $t('privacy.collectionTitle') }}</h4>
          <p>{{ $t('privacy.collectionIntro') }}</p>
          <ul>
            <li>{{ $t('privacy.collection1') }}</li>
            <li>{{ $t('privacy.collection2') }}</li>
            <li>{{ $t('privacy.collection3') }}</li>
          </ul>

          <h4>{{ $t('privacy.usageTitle') }}</h4>
          <ul>
            <li>{{ $t('privacy.usage1') }}</li>
            <li>{{ $t('privacy.usage2') }}</li>
            <li>{{ $t('privacy.usage3') }}</li>
          </ul>

          <h4>{{ $t('privacy.storageTitle') }}</h4>
          <ul>
            <li>{{ $t('privacy.storage1') }}</li>
            <li>{{ $t('privacy.storage2') }}</li>
            <li>{{ $t('privacy.storage3') }}</li>
          </ul>

          <h4>{{ $t('privacy.thirdPartyTitle') }}</h4>
          <ul>
            <li>{{ $t('privacy.thirdParty1') }}</li>
            <li>{{ $t('privacy.thirdParty2') }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="showHelp" class="modal-overlay" @click="showHelp = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('help.title') }}</h3>
          <button @click="showHelp = false" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>
        <div class="modal-content">
          <h4>{{ $t('help.howToTitle') }}</h4>
          <ol>
            <li>{{ $t('help.howTo1') }}</li>
            <li>{{ $t('help.howTo2') }}</li>
            <li>{{ $t('help.howTo3') }}</li>
            <li>{{ $t('help.howTo4') }}</li>
          </ol>

          <h4>{{ $t('help.examplesTitle') }}</h4>
          <ul>
            <li>{{ $t('help.example1') }}</li>
            <li>{{ $t('help.example2') }}</li>
            <li>{{ $t('help.example3') }}</li>
            <li>{{ $t('help.example4') }}</li>
            <li>{{ $t('help.example5') }}</li>
            <li>{{ $t('help.example6') }}</li>
          </ul>

          <h4>{{ $t('help.tipsTitle') }}</h4>
          <ul>
            <li>{{ $t('help.tip1') }}</li>
            <li>{{ $t('help.tip2') }}</li>
            <li>{{ $t('help.tip3') }}</li>
            <li>{{ $t('help.tip4') }}</li>
            <li>{{ $t('help.tip5') }}</li>
          </ul>

          <h4>{{ $t('help.shortcutsTitle') }}</h4>
          <ul>
            <li><kbd>Ctrl + Enter</kbd> / <kbd>⌘ + Enter</kbd>: {{ $t('help.shortcutConvert') }}</li>
            <li><kbd>Ctrl + C</kbd>: {{ $t('help.shortcutCopy') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { Radio, Car, BrainCircuit, Globe, Smartphone, Zap, Target, ArrowUp, Share2, X } from '@lucide/vue'
import AppIcon from './AppIcon.vue'

export default {
  name: 'AppFooter',
  components: { AppIcon },
  setup() {
    return { Radio, Car, BrainCircuit, Globe, Smartphone, Zap, Target, ArrowUp, Share2, X }
  },
  data() {
    return {
      showAbout: false,
      showPrivacy: false,
      showHelp: false,
      canInstall: false,
      usingRealData: false,
      stats: {
        conversions: 0,
        languages: 8,
        countries: 12
      },
      performance: {
        responseTime: 75,
        cacheHitRate: 89,
        apiStatus: 'online'
      },
      quickExamples: [
        '150 000 m²',
        '5 000 kg', 
        '20 meters',
        '25 000 EUR'
      ]
    }
  },
  mounted() {
    // Check if app can be installed
    window.addEventListener('beforeinstallprompt', () => {
      this.canInstall = true;
    });
    
    // Hide install option if already installed
    window.addEventListener('appinstalled', () => {
      this.canInstall = false;
    });
    
    // Load stats once on mount. No polling — the Statistics section has a
    // manual Refresh button, so we avoid repeated background /stats requests.
    this.loadStats();
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    },
    
    async installApp() {
      // Emit event to parent component to handle PWA installation
      this.$emit('install-app');
    },
    
    async shareApp() {
      const shareData = {
        title: 'Škoda Fabia Converter',
        text: 'Automotive unit conversion tool specialized for Škoda Fabia specifications',
        url: window.location.href
      };
      
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        this.showToast(this.$t('footer.toastLinkCopied'));
      }
    },
    
    async loadStats() {
      try {
        // Load from localStorage first for fast display
        const cachedStats = localStorage.getItem('app-stats');
        if (cachedStats) {
          this.stats = { ...this.stats, ...JSON.parse(cachedStats) };
        }
        
        // Fetch real statistics from API
        const response = await fetch('https://skoda-fabia-api.kornelko.workers.dev/stats');
        if (response.ok) {
          const apiStats = await response.json();
          
          // Map API data to display stats
          this.stats = {
            conversions: apiStats.overview.totalRequestsServed || 0,
            languages: apiStats.languageUsage ? apiStats.languageUsage.length : 8,
            countries: this.calculateCountries(apiStats.languageUsage || [])
          };
          
          // Mark as using real data
          this.usingRealData = true;
          
          // Update performance stats from API
          this.performance = {
            responseTime: 75, // Keep average response time
            cacheHitRate: parseInt(apiStats.overview.cacheHitRate) || 0,
            apiStatus: 'online'
          };
          
          // Save to localStorage
          localStorage.setItem('app-stats', JSON.stringify(this.stats));
          console.log('Real stats loaded:', this.stats);
        } else {
          // Fallback to simulated stats if API fails
          this.usingRealData = false;
          this.updateStats();
        }
      } catch (err) {
        console.log('Failed to load real stats, using fallback:', err);
        // Fallback to simulated stats if API fails
        this.usingRealData = false;
        this.updateStats();
      }
    },
    
    calculateCountries(languageUsage) {
      // Map languages to their typical countries and count unique regions
      const languageCountryMap = {
        'english': ['US', 'UK', 'CA', 'AU'],
        'czech': ['CZ'],
        'slovak': ['SK'], 
        'hungarian': ['HU'],
        'polish': ['PL'],
        'german': ['DE', 'AT', 'CH'],
        'spanish': ['ES', 'MX', 'AR'],
        'french': ['FR', 'CA', 'BE']
      };
      
      const countries = new Set();
      languageUsage.forEach(lang => {
        const langCountries = languageCountryMap[lang.language] || [];
        langCountries.forEach(country => countries.add(country));
      });
      
      // Return at least 12 countries (include potential countries even if no usage yet)
      return Math.max(countries.size, 12);
    },
    
    updateStats() {
      // Only use simulated stats if no real data is available
      if (this.stats.conversions === 0) {
        // Simulate growing usage stats as fallback
        const baseConversions = 15420;
        const dailyGrowth = Math.floor(Math.random() * 50) + 20;
        const daysSinceLaunch = Math.floor((Date.now() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24));
        
        this.stats.conversions = baseConversions + (daysSinceLaunch * dailyGrowth);
        
        // Save to localStorage
        localStorage.setItem('app-stats', JSON.stringify(this.stats));
      }
    },
    
    showToast(message) {
      // Simple toast notification
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed; 
        bottom: 2rem; 
        left: 50%; 
        transform: translateX(-50%); 
        background: #333; 
        color: white; 
        padding: 0.75rem 1.5rem; 
        border-radius: 6px; 
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  }
}
</script>

<style scoped>
.footer {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  margin-top: 4rem;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--skoda-green);
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section h3 {
  font-size: 1.25rem;
}

.footer-section h4 {
  font-size: 1rem;
}

.footer-brand p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #c62828;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  /* Pulse via box-shadow (not opacity) so the white text keeps full contrast. */
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.5); }
  50% { box-shadow: 0 0 0 5px rgba(198, 40, 40, 0); }
}

.stats-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--skoda-green);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-link {
  background: none;
  border: none;
  color: #666;
  text-align: left;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  min-width: auto;
  width: auto;
}

.quick-link:hover {
  color: var(--skoda-green);
  background: none;
  transform: none;
  box-shadow: none;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0;
  color: #666;
  font-size: 0.8125rem;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.footer-btn {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  min-width: auto;
  width: 100%;
}

.footer-btn.primary {
  background: var(--skoda-green);
  color: white;
  border-color: var(--skoda-green);
}

.footer-btn.primary:hover {
  background: var(--skoda-green-dark);
  border-color: var(--skoda-green-dark);
}

.footer-btn.secondary {
  background: white;
  color: var(--skoda-green);
  border-color: var(--skoda-green);
}

.footer-btn.secondary:hover {
  background: var(--skoda-green-light);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #666;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--skoda-green);
}

.support-links {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.bmc-link {
  display: inline-flex;
  height: 48px;
}
.bmc-img {
  height: 48px;
  width: auto;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: block;
}
.github-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 48px;
  padding: 0 1.1rem;
  box-sizing: border-box;
  background: #24292f;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.2s ease, transform 0.2s ease;
}
.github-link:hover {
  background: #000;
  transform: translateY(-1px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.footer-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6e6e6e;
  flex-wrap: wrap;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-link {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  transition: color 0.2s ease;
  min-width: auto;
  width: auto;
}

.footer-link:hover {
  color: var(--skoda-green);
  background: none;
  transform: none;
  box-shadow: none;
}

.performance-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.perf-item {
  text-align: center;
}

.perf-label {
  display: block;
  font-size: 0.75rem;
  color: #6e6e6e;
  margin-bottom: 0.25rem;
}

.perf-value {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.perf-value.online {
  color: var(--skoda-green);
}

.perf-value.offline {
  color: #dc3545;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: var(--skoda-green);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  min-width: auto;
  width: auto;
}

.modal-content {
  padding: 1.5rem;
  line-height: 1.6;
}

.modal-content h4 {
  color: var(--skoda-green);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.modal-content h4:first-child {
  margin-top: 0;
}

.modal-content ul,
.modal-content ol {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.modal-content li {
  margin-bottom: 0.5rem;
}

kbd {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 0.125rem 0.25rem;
  font-size: 0.875em;
  font-family: monospace;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-stats {
    justify-content: space-around;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .footer-meta {
    justify-content: center;
  }
  
  .performance-info {
    gap: 1rem;
  }
  
  .modal {
    margin: 0.5rem;
    max-height: 95vh;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>