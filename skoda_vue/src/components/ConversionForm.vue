<template>
  <div class="conversion-form">
    <div class="container">
      <!-- Input Section -->
      <div class="input-section card">
        <component :is="headingLevel" class="form-title"><AppIcon :icon="Car" :size="24" /> {{ $t('form.title') }}</component>
        <p class="section-description">{{ $t('form.description') }}</p>

        <div class="input-group">
          <label for="measurement-input">{{ $t('form.inputLabel') }}</label>
          <textarea
            id="measurement-input"
            v-model="userInput"
            :placeholder="$t('form.placeholder')"
            rows="3"
            :disabled="loading"
            @keydown.ctrl.enter="handleConvert"
            @keydown.meta.enter="handleConvert"
          ></textarea>
          <div class="input-hint">
            <AppIcon :icon="Target" :size="16" /> {{ $t('form.hint') }}
          </div>
        </div>
        
        <details class="options-disclosure">
          <summary class="options-summary">
            <AppIcon :icon="SlidersHorizontal" :size="16" /> {{ $t('form.options') }}
          </summary>
          <div class="form-row">
            <div class="form-group">
              <label for="language-select">{{ $t('form.responseLanguage') }}</label>
              <select
                id="language-select"
                v-model="selectedLanguage"
                :disabled="loading"
              >
                <option
                  v-for="language in languages"
                  :key="language.code"
                  :value="language.value"
                >
                  {{ language.flag }} {{ language.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="explanation-select">{{ $t('form.explanationStyle') }}</label>
              <select
                id="explanation-select"
                v-model="selectedExplanationType"
                :disabled="loading"
              >
                <option value="funny">{{ $t('form.funnyOption') }}</option>
                <option value="scientific">{{ $t('form.scientificOption') }}</option>
              </select>
            </div>
          </div>
        </details>

        <button
          @click="handleConvert" 
          :disabled="!userInput.trim() || loading"
          class="convert-btn"
        >
          <span v-if="loading" class="loading"></span>
          <AppIcon v-else :icon="ArrowRightLeft" :size="20" />
          {{ loading ? $t('form.converting') : $t('form.convert') }}
        </button>
      </div>
      
      <!-- Results Section -->
      <div v-if="result || error" class="results-section">
        <!-- Success Result -->
        <div v-if="result" class="result-card card">
          <div class="result-header">
            <h3>{{ $t('result.title') }}</h3>
            <div class="result-meta">
              <span class="explanation-badge">
                <AppIcon :icon="result.explanationType === 'funny' ? PartyPopper : FlaskConical" :size="14" />
                {{ result.explanationType === 'funny' ? $t('result.funnyBadge') : $t('result.scientificBadge') }}
              </span>
              <span class="language-badge">{{ getLanguageName(result.language) }}</span>
              <span v-if="result.cached" class="cache-badge" :title="$t('result.cachedTitle')"><AppIcon :icon="Zap" :size="14" /> {{ $t('result.cached') }}</span>
            </div>
          </div>
          
          <div class="result-content">
            <div class="original-request">
              <strong>{{ $t('result.request') }}</strong> {{ result.original_request }}
            </div>

            <div class="conversion-details" v-if="result.conversion">
              <div class="conversion-summary">
                <strong><AppIcon :icon="ChartColumnBig" :size="16" /> {{ $t('result.conversion') }}</strong>
                {{ result.conversion.inputValue }} {{ result.conversion.inputUnit }} =
                <span class="fabia-result">{{ result.conversion.resultValue }} {{ $t('common.skodaFabias') }}</span>
              </div>
              <div class="calculation">
                <small>{{ result.conversion.calculation }}</small>
              </div>
            </div>
            
            <div class="conversion-result">
              <div class="result-text" v-html="formatResult(result.aiResponse || result.result || $t('result.noExplanation'))"></div>
            </div>
            
            <div v-if="result.explanation" class="explanation">
              <details>
                <summary><AppIcon :icon="BookOpen" :size="16" /> {{ $t('result.detailedExplanation') }}</summary>
                <div class="explanation-content" v-html="formatExplanation(result.explanation)"></div>
              </details>
            </div>

            <!-- Branding so a screenshot of the result is self-explanatory -->
            <div class="result-credit">
              <AppIcon :icon="Car" :size="16" /> Škoda Fabia Converter · fabia-conv.crayz.me
            </div>
          </div>

          <div class="result-actions">
            <button @click="shareResult" class="action-btn primary">
              <AppIcon :icon="Share2" :size="16" /> {{ $t('result.share') }}
            </button>
            <button @click="copyResult" class="action-btn">
              <AppIcon :icon="Copy" :size="16" /> {{ $t('result.copyResult') }}
            </button>
            <button @click="generateEmbed" class="action-btn">
              <AppIcon :icon="Link2" :size="16" /> {{ $t('result.embedCode') }}
            </button>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="error-card card">
          <div class="error-header">
            <h3><AppIcon :icon="CircleX" :size="20" /> {{ $t('error.title') }}</h3>
          </div>
          <div class="error-content">
            <p>{{ error }}</p>
            <div class="error-suggestions">
              <strong>{{ $t('error.tryFormats') }}</strong>
              <ul>
                <li><strong>{{ $t('error.area') }}</strong> "150000 m²", "1 hectare", "100 m²"</li>
                <li><strong>{{ $t('error.weight') }}</strong> "500 kg", "5000 kg", "2 tons"</li>
                <li><strong>{{ $t('error.length') }}</strong> "20 meters", "1 km", "100 feet"</li>
                <li><strong>{{ $t('error.price') }}</strong> "50000 EUR", "25000 USD"</li>
              </ul>
            </div>
          </div>
          <button @click="clearError" class="action-btn">{{ $t('common.tryAgain') }}</button>
        </div>
      </div>
      
      <!-- Quick Examples -->
      <div v-if="!result && !error && !loading" class="examples-section card">
        <h3><AppIcon :icon="Wrench" :size="20" /> {{ $t('examples.heading') }}</h3>
        <div class="conversion-categories">
          <div class="category">
            <h4>{{ $t('examples.areaSpace') }}</h4>
            <div class="category-examples">
              <button @click="useExample('150000 m²')" class="example-btn">
                150000 m² <span class="hint">{{ $t('examples.footballFields') }}</span>
              </button>
              <button @click="useExample('100 m²')" class="example-btn">
                100 m² <span class="hint">{{ $t('examples.apartmentSize') }}</span>
              </button>
              <button @click="useExample('1 hectare')" class="example-btn">
                1 hectare <span class="hint">{{ $t('examples.parkArea') }}</span>
              </button>
            </div>
          </div>
          
          <div class="category">
            <h4>{{ $t('examples.weightMass') }}</h4>
            <div class="category-examples">
              <button @click="useExample('5000 kg')" class="example-btn">
                5000 kg <span class="hint">{{ $t('examples.elephantWeight') }}</span>
              </button>
              <button @click="useExample('500 kg')" class="example-btn">
                500 kg <span class="hint">{{ $t('examples.pianoWeight') }}</span>
              </button>
              <button @click="useExample('2 tons')" class="example-btn">
                2 tons <span class="hint">{{ $t('examples.smallCar') }}</span>
              </button>
            </div>
          </div>
          
          <div class="category">
            <h4>{{ $t('examples.lengthDistance') }}</h4>
            <div class="category-examples">
              <button @click="useExample('20 meters')" class="example-btn">
                20 meters <span class="hint">{{ $t('examples.swimmingPool') }}</span>
              </button>
              <button @click="useExample('1 km')" class="example-btn">
                1 km <span class="hint">{{ $t('examples.walkDistance') }}</span>
              </button>
              <button @click="useExample('100 feet')" class="example-btn">
                100 feet <span class="hint">{{ $t('examples.buildingHeight') }}</span>
              </button>
            </div>
          </div>
          
          <div class="category">
            <h4>{{ $t('examples.priceValue') }}</h4>
            <div class="category-examples">
              <button @click="useExample('50000 EUR')" class="example-btn">
                50000 EUR <span class="hint">{{ $t('examples.luxuryCarPrice') }}</span>
              </button>
              <button @click="useExample('25000 USD')" class="example-btn">
                25000 USD <span class="hint">{{ $t('examples.newCarPrice') }}</span>
              </button>
              <button @click="useExample('100000 CZK')" class="example-btn">
                100000 CZK <span class="hint">{{ $t('examples.downPayment') }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="fabia-facts">
          <h4><AppIcon :icon="Ruler" :size="18" /> {{ $t('examples.specsTitle') }}</h4>
          <div class="specs-grid">
            <div class="spec-item">{{ $t('examples.specLength') }}: 4.002 m</div>
            <div class="spec-item">{{ $t('examples.specWidth') }}: 1.646 m</div>
            <div class="spec-item">{{ $t('examples.specHeight') }}: 1.441 m</div>
            <div class="spec-item">{{ $t('examples.specWeight') }}: 1,035 kg</div>
            <div class="spec-item">{{ $t('examples.specPrice') }}: €16,500</div>
            <div class="spec-item">{{ $t('examples.specArea') }}: ~6.587 m²</div>
          </div>
        </div>
      </div>
      
      <!-- Embed Dialog -->
      <div v-if="showEmbedDialog" class="embed-dialog-overlay" @click="closeEmbedDialog">
        <div class="embed-dialog" @click.stop>
          <div class="embed-header">
            <h3>{{ $t('embed.title') }}</h3>
            <button @click="closeEmbedDialog" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
          </div>

          <div class="embed-content">
            <div class="embed-options">
              <h4>{{ $t('embed.type') }}</h4>
              <div class="embed-type-selector">
                <label 
                  v-for="type in embedTypes" 
                  :key="type.id"
                  class="embed-type-option"
                  :class="{ active: selectedEmbedType === type.id }"
                >
                  <input 
                    type="radio" 
                    :value="type.id" 
                    v-model="selectedEmbedType"
                    @change="generateEmbed"
                  >
                  <div class="option-content">
                    <div class="option-name">{{ type.name }}</div>
                    <div class="option-description">{{ type.description }}</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="embed-preview">
              <h4>{{ $t('embed.preview') }}</h4>
              <div class="preview-frame" v-html="embedCode"></div>
            </div>

            <div class="embed-code-section">
              <p>{{ $t('embed.copyDesc') }}</p>
              <textarea 
                v-model="embedCode" 
                readonly 
                rows="8"
                class="embed-code"
              ></textarea>
            </div>
          </div>
          
          <div class="embed-actions">
            <button @click="copyEmbedCode" class="action-btn">
              <AppIcon :icon="Copy" :size="16" /> {{ $t('embed.copyCode') }}
            </button>
            <button @click="closeEmbedDialog" class="action-btn secondary">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Car, Target, PartyPopper, FlaskConical, Zap, ChartColumnBig, BookOpen,
  Copy, Share2, Link2, CircleX, Wrench, Ruler, ArrowRightLeft, X, SlidersHorizontal
} from '@lucide/vue'
import AppIcon from './AppIcon.vue'

export default {
  name: 'ConversionForm',
  components: { AppIcon },
  setup() {
    return {
      Car, Target, PartyPopper, FlaskConical, Zap, ChartColumnBig, BookOpen,
      Copy, Share2, Link2, CircleX, Wrench, Ruler, ArrowRightLeft, X, SlidersHorizontal
    }
  },
  props: {
    // Optional measurement to prefill the input with (used by landing pages).
    // The deep-link ?q= param takes precedence over this.
    initialInput: { type: String, default: '' },
    // Heading tag for the form title — 'h1' on the home page (it's the page's
    // main heading), 'h2' on landing pages (which already own the <h1>).
    headingLevel: { type: String, default: 'h1' }
  },
  data() {
    return {
      userInput: '',
      selectedLanguage: 'english',
      selectedExplanationType: 'funny',
      loading: false,
      result: null,
      error: null,
      showEmbedDialog: false,
      embedCode: '',
      selectedEmbedType: 'full',
      languages: [
        { code: 'cs', name: 'Čeština', flag: '🇨🇿', value: 'czech' },
        { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', value: 'slovak' },
        { code: 'hu', name: 'Magyar', flag: '🇭🇺', value: 'hungarian' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱', value: 'polish' },
        { code: 'en', name: 'English', flag: '🇬🇧', value: 'english' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', value: 'german' },
        { code: 'es', name: 'Español', flag: '🇪🇸', value: 'spanish' },
        { code: 'fr', name: 'Français', flag: '🇫🇷', value: 'french' }
      ],
      quickExamples: [
        '150 000 m²',
        '5 000 kg', 
        '20 meters',
        '1 hectare',
        '500 kg',
        '100 m²',
        '1 km',
        '25 000 EUR',
        '2.5k m²',
        '1.5M EUR',
        '200 HP',
        '150 kW',
        '8 l/100km'
      ]
    }
  },
  computed: {
    embedTypes() {
      return [
        { id: 'full', name: this.$t('embed.fullName'), description: this.$t('embed.fullDesc') },
        { id: 'compact', name: this.$t('embed.compactName'), description: this.$t('embed.compactDesc') },
        { id: 'calculation', name: this.$t('embed.calculationName'), description: this.$t('embed.calculationDesc') },
        { id: 'api', name: this.$t('embed.apiName'), description: this.$t('embed.apiDesc') }
      ];
    },
    embedPreview() {
      if (!this.result) return '';
      return `
        <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 8px; font-family: sans-serif;">
          <strong>${this.result.original_request}</strong><br>
          <div style="margin: 0.5rem 0; color: #00A651; font-weight: bold;">
            ${this.result.result}
          </div>
          <small style="color: #666;">Powered by Fabia Converter</small>
        </div>
      `;
    }
  },
  watch: {
    // Keep the response language in sync with the active UI locale.
    '$i18n.locale': {
      handler(code) {
        const language = this.languages.find(l => l.code === code);
        if (language) {
          this.selectedLanguage = language.value;
        }
      },
      immediate: true
    },
    // React to deep-link changes pushed via the router (e.g. an example chip on
    // another page navigates to /?q=… while this component is already mounted).
    '$route.query.q'(q) {
      if (q && q !== this.userInput) {
        this.applyDeepLink();
      }
    }
  },
  mounted() {
    const hasQuery = new URLSearchParams(window.location.search).has('q');
    if (hasQuery) {
      this.applyDeepLink();
    } else if (this.initialInput) {
      // Prefill from a landing page without firing an API call; the user hits
      // Convert to get the AI explanation.
      this.userInput = this.initialInput;
    }
  },
  methods: {
    // --- Deep-linkable conversions -------------------------------------------
    // A conversion is fully reproducible from the raw input + language + style.
    // We encode those as query params so a shared link reopens the exact result.
    applyDeepLink() {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (!q) return;

      this.userInput = q;

      const lang = params.get('lang');
      if (lang && this.languages.some(l => l.value === lang)) {
        this.selectedLanguage = lang;
      }
      const style = params.get('style');
      if (style === 'funny' || style === 'scientific') {
        this.selectedExplanationType = style;
      }

      // Auto-run the conversion so the link reproduces the result on open.
      this.handleConvert();
    },

    buildShareUrl() {
      const base = window.location.origin + window.location.pathname;
      const params = new URLSearchParams({
        q: this.result ? this.result.original_request : this.userInput.trim(),
        lang: this.selectedLanguage,
        style: this.selectedExplanationType
      });
      return `${base}?${params.toString()}`;
    },

    // Keep the address bar in sync with the current result so it's always
    // shareable (without adding a new history entry per conversion).
    syncUrlToResult() {
      try {
        window.history.replaceState(null, '', this.buildShareUrl());
      } catch (err) {
        console.warn('Could not update URL:', err);
      }
    },

    parseUserInput(input) {
      // Clean the input - remove extra spaces and normalize
      const cleanInput = input.trim().replace(/\s+/g, ' ');
      
      // Enhanced regex to handle spaced numbers, thousand separators, and units
      // Matches: "150 000 m2", "150,000 m²", "150k m2", "1.5M m²", etc.
      const match = cleanInput.match(/([0-9.,\s]+[kmgtKMGT]?)\s*([a-zA-Z²³°/]+)/);
      
      if (!match) {
        // Fallback for unstructured input - default to weight
        return {
          type: "weight",
          value: 1,
          unit: "kg"
        };
      }
      
      let numberString = match[1].trim();
      let unit = match[2].toLowerCase();
      
      // Parse the number with various formats
      let value = this.parseNumberWithSeparators(numberString);
      
      // Normalize area units for backend compatibility
      if (unit.includes('m²')) {
        unit = 'm2';
      }
      
      // Map units to measurement types based on backend schema
      if (unit.includes('m2') || unit.includes('hectare') || unit.includes('acre') || unit.includes('sqm') || unit.includes('km2') || unit.includes('cm2') || unit.includes('mm2') || unit.includes('ft2') || unit.includes('in2') || unit.includes('yd2')) {
        return { type: "area", value, unit: unit };
      }
      
      if (unit.includes('kg') || unit.includes('ton') || unit.includes('lb') || unit.includes('pound')) {
        return { type: "weight", value, unit: unit };
      }
      
      if (unit.includes('hp') || unit.includes('kw') || unit.includes('ps')) {
        return { type: "power", value, unit: unit };
      }
      
      if (unit.includes('l/100km') || unit.includes('l/h') || unit.includes('mpg') || unit.includes('l/km')) {
        return { type: "consumption", value, unit: unit };
      }
      
      if (unit.includes('m') || unit.includes('km') || unit.includes('ft') || unit.includes('mile') || unit.includes('yard') || unit.includes('cm') || unit.includes('mm')) {
        // Check if it might be area (has ² or similar)
        if (input.includes('²') || input.includes('square')) {
          return { type: "area", value, unit: unit };
        }
        return { type: "length", value, unit: unit };
      }
      
      if (unit.includes('eur') || unit.includes('usd') || unit.includes('$') || unit.includes('€') || unit.includes('czk') || unit.includes('crown')) {
        return { type: "price", value, unit: unit };
      }
      
      // Default fallback to weight for any unrecognized unit
      return { type: "weight", value, unit: unit };
    },
    
    parseNumberWithSeparators(numberString) {
      // Handle various number formats
      let cleanNumber = numberString;
      
      // Handle suffixes (k, M, G, T, etc.)
      const suffixMap = {
        'k': 1000,
        'm': 1000000,
        'g': 1000000000,
        't': 1000000000000,
        'K': 1000,
        'M': 1000000,
        'G': 1000000000,
        'T': 1000000000000
      };
      
      let multiplier = 1;
      const lastChar = cleanNumber.slice(-1);
      if (suffixMap[lastChar]) {
        multiplier = suffixMap[lastChar];
        cleanNumber = cleanNumber.slice(0, -1);
      }
      
      // Remove spaces and handle thousand separators
      // Support both comma and space as thousand separators
      cleanNumber = cleanNumber.replace(/\s/g, ''); // Remove spaces
      
      // Handle European format (space as thousand separator, comma as decimal)
      if (cleanNumber.includes(',') && !cleanNumber.includes('.')) {
        // Check if comma is likely a decimal separator (only one comma at the end)
        const commaCount = (cleanNumber.match(/,/g) || []).length;
        const lastCommaIndex = cleanNumber.lastIndexOf(',');
        
        if (commaCount === 1 && cleanNumber.length - lastCommaIndex <= 3) {
          // Likely decimal separator: "123,45"
          cleanNumber = cleanNumber.replace(',', '.');
        } else {
          // Likely thousand separator: "123,456,789"
          cleanNumber = cleanNumber.replace(/,/g, '');
        }
      } else if (cleanNumber.includes(',') && cleanNumber.includes('.')) {
        // Both comma and dot present - assume comma is thousand separator: "1,234.56"
        cleanNumber = cleanNumber.replace(/,/g, '');
      }
      
      const value = parseFloat(cleanNumber) * multiplier;
      return isNaN(value) ? 1 : value;
    },

    async handleConvert() {
      if (!this.userInput.trim() || this.loading) return;
      
      this.loading = true;
      this.error = null;
      this.result = null;
      
      try {
        const measurement = this.parseUserInput(this.userInput);
        
        // Debug logging
        console.log('Parsed measurement:', measurement);
        console.log('Original input:', this.userInput);
        
        const response = await fetch('https://skoda-fabia-api.kornelko.workers.dev/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `Convert ${this.userInput.trim()} to Škoda Fabia units. Express this measurement in terms of how many Škoda Fabias it equals.`,
            language: this.selectedLanguage,
            explanationType: this.selectedExplanationType,
            measurement: measurement
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Conversion failed');
        }
        
        const data = await response.json();
        this.result = {
          ...data,
          original_request: this.userInput.trim(),
          explanationType: this.selectedExplanationType,
          language: this.selectedLanguage
        };

        // Reflect this conversion in the URL so it can be shared / reopened.
        this.syncUrlToResult();

        // Scroll to results
        this.$nextTick(() => {
          const resultsSection = document.querySelector('.results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
        
      } catch (err) {
        this.error = err.message || 'Something went wrong. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    useExample(example) {
      this.userInput = example;
      this.handleConvert();
    },
    
    clearError() {
      this.error = null;
    },
    
    formatResult(text) {
      if (!text) return '';
      // Escape HTML first (content comes from the LLM and is injected via v-html)
      const escaped = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return escaped
        // Markdown bold: **text** or __text__ (Unicode-safe, no \w restriction)
        .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+?)__/g, '<strong>$1</strong>')
        // Markdown italic: *text* (single asterisk, not part of a ** pair)
        .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
        // Highlight standalone equals signs
        .replace(/\s=\s/g, ' <span style="color: var(--skoda-green);">=</span> ')
        // Preserve line breaks from the model
        .replace(/\n/g, '<br>');
    },
    
    formatExplanation(text) {
      // Format explanation with better typography
      return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        .replace(/(\d+\.?\d*)\s*([a-zA-Z°]+)/g, '<code>$1 $2</code>');
    },
    
    getLanguageName(languageValue) {
      const lang = this.languages.find(l => l.value === languageValue);
      return lang ? `${lang.flag} ${lang.name}` : languageValue;
    },
    
    async copyResult() {
      const conversionText = this.result.conversion ? 
        `${this.result.conversion.inputValue} ${this.result.conversion.inputUnit} = ${this.result.conversion.resultValue} Škoda Fabias\n` : '';
      const text = `${this.result.original_request}\n\n${conversionText}${this.result.aiResponse || this.result.result || ''}`;
      try {
        await navigator.clipboard.writeText(text);
        this.showToast(this.$t('result.toastResultCopied'));
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
    
    async shareResult() {
      const conversionText = this.result.conversion ?
        `${this.result.conversion.inputValue} ${this.result.conversion.inputUnit} = ${this.result.conversion.resultValue} Škoda Fabias\n` : '';
      const text = `${this.result.original_request}\n\n${conversionText}${this.result.aiResponse || this.result.result || ''}\n\nPowered by Fabia Converter`;
      const shareUrl = this.buildShareUrl();

      if (navigator.share) {
        try {
          await navigator.share({
            title: this.$t('result.title'),
            text: text,
            url: shareUrl
          });
          return;
        } catch (err) {
          // AbortError = user dismissed the sheet; otherwise fall back to copy.
          if (err && err.name === 'AbortError') return;
        }
      }
      // Fallback: copy a link that reproduces this exact conversion.
      try {
        await navigator.clipboard.writeText(shareUrl);
        this.showToast(this.$t('header.toastLinkCopied'));
      } catch (err) {
        console.error('Failed to copy share link:', err);
        await this.copyResult();
      }
    },
    
    generateEmbed() {
      if (!this.result) return;
      
      const conversionText = this.result.conversion ? 
        `${this.result.conversion.inputValue} ${this.result.conversion.inputUnit} = ${this.result.conversion.resultValue} Škoda Fabias` : 
        '';
      
      const aiExplanation = this.result.aiResponse || this.result.result || '';
      const requestId = this.result.requestId || '';
      
      // Create API link for this specific conversion
      const apiLink = requestId ? 
        `https://skoda-fabia-api.kornelko.workers.dev/conversions/${requestId}` : 
        'https://skoda-fabia-api.kornelko.workers.dev/stats';
      
      let embedContent = '';
      
      switch (this.selectedEmbedType) {
        case 'full':
          embedContent = `<!-- Škoda Fabia Converter Embed - Full Result -->
<div class="fabia-embed" style="border: 1px solid #00A651; padding: 1rem; border-radius: 8px; font-family: Arial, sans-serif; max-width: 500px; margin: 1rem 0; background: #f8fff8;">
  <div style="font-weight: bold; margin-bottom: 0.5rem; color: #00A651;">
    🚗 ${this.result.original_request}
  </div>
  ${conversionText ? `<div style="color: #00A651; font-size: 1.1em; font-weight: bold; margin: 0.5rem 0; padding: 0.5rem; background: #e8f5e8; border-radius: 4px;">
    ${conversionText}
  </div>` : ''}
  ${aiExplanation ? `<div style="color: #333; font-size: 0.9em; line-height: 1.4; margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #00A651;">
    ${aiExplanation.length > 200 ? aiExplanation.substring(0, 200) + '...' : aiExplanation}
  </div>` : ''}
  <div style="font-size: 0.8em; color: #666; border-top: 1px solid #e0e0e0; padding-top: 0.5rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
    <span>Powered by <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">Škoda Fabia Converter</a></span>
    <a href="${apiLink}" style="color: #00A651; text-decoration: none; font-size: 0.75em; padding: 0.25rem 0.5rem; border: 1px solid #00A651; border-radius: 3px;" title="View API data">📊 API</a>
  </div>
</div>`;
          break;
          
        case 'compact':
          embedContent = `<!-- Škoda Fabia Converter Embed - Compact -->
<div class="fabia-embed" style="border: 1px solid #00A651; padding: 0.75rem; border-radius: 6px; font-family: Arial, sans-serif; max-width: 350px; margin: 1rem 0; background: #f8fff8;">
  <div style="color: #00A651; font-weight: bold; margin-bottom: 0.25rem;">🚗 ${this.result.original_request}</div>
  ${conversionText ? `<div style="color: #00A651; font-size: 1em; font-weight: bold;">
    ${conversionText}
  </div>` : ''}
  <div style="font-size: 0.75em; color: #666; margin-top: 0.5rem; text-align: right;">
    <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">Škoda Fabia Converter</a>
  </div>
</div>`;
          break;
          
        case 'calculation':
          embedContent = `<!-- Škoda Fabia Converter Embed - Calculation Only -->
<div class="fabia-embed" style="border: 1px solid #00A651; padding: 0.5rem; border-radius: 4px; font-family: Arial, sans-serif; max-width: 300px; margin: 1rem 0; background: #e8f5e8; text-align: center;">
  <div style="color: #00A651; font-weight: bold; font-size: 1.1em;">
    ${conversionText || this.result.original_request}
  </div>
  <div style="font-size: 0.7em; color: #666; margin-top: 0.25rem;">
    <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">🚗 Fabia Converter</a>
  </div>
</div>`;
          break;
          
        case 'api':
          embedContent = `<!-- Škoda Fabia Converter API Link -->
<div class="fabia-api-link" style="display: inline-block; padding: 0.5rem 1rem; background: #00A651; color: white; border-radius: 6px; font-family: Arial, sans-serif; text-decoration: none; margin: 0.5rem;">
  <a href="${apiLink}" style="color: white; text-decoration: none; font-weight: bold;">
    📊 View Conversion Data: ${this.result.original_request}
  </a>
</div>
<!-- Raw API URL: ${apiLink} -->`;
          break;
      }
      
      this.embedCode = embedContent;
      
      if (!this.showEmbedDialog) {
        this.showEmbedDialog = true;
      }
    },
    
    async copyEmbedCode() {
      try {
        await navigator.clipboard.writeText(this.embedCode);
        this.showToast(this.$t('header.toastEmbedCopied'));
        this.closeEmbedDialog();
      } catch (err) {
        console.error('Failed to copy embed code:', err);
      }
    },
    
    closeEmbedDialog() {
      this.showEmbedDialog = false;
      this.embedCode = '';
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
.conversion-form {
  padding: 2rem 0;
}

.input-section {
  margin-bottom: 2rem;
}

.input-section .form-title {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--skoda-green);
  margin-bottom: 0.5rem;
  text-align: center;
}

.section-description {
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
}

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.options-disclosure {
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.options-summary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
  user-select: none;
  list-style: none;
}

.options-summary::-webkit-details-marker {
  display: none;
}

.options-summary::after {
  content: '';
  width: 8px;
  height: 8px;
  margin-left: auto;
  border-right: 2px solid #999;
  border-bottom: 2px solid #999;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.options-disclosure[open] .options-summary::after {
  transform: rotate(-135deg);
}

.options-summary:hover {
  color: var(--skoda-green);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0 0.875rem 0.875rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.convert-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.results-section {
  margin-bottom: 2rem;
}

.result-card {
  border-left: 4px solid var(--skoda-green);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-header h3 {
  color: var(--skoda-green);
  margin: 0;
}

.result-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.explanation-badge, .language-badge, .cache-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.explanation-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.language-badge {
  background: #f3e5f5;
  color: #7b1fa2;
}

.cache-badge {
  background: #fff3e0;
  color: #f57c00;
}

.original-request {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.conversion-result {
  margin-bottom: 1rem;
}

.result-text {
  font-size: 1.25rem;
  line-height: 1.4;
  color: #333;
}

.explanation {
  margin-top: 1rem;
}

.explanation details {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.explanation summary {
  background: #f8f9fa;
  padding: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  user-select: none;
}

.explanation summary:hover {
  background: #e9ecef;
}

.explanation-content {
  padding: 1rem;
  line-height: 1.6;
}

.result-credit {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
  color: #6a6a6a;
  font-size: 0.8125rem;
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: auto;
  width: auto;
}

.action-btn:hover {
  background: var(--skoda-green-light);
  border-color: var(--skoda-green);
  color: var(--skoda-green);
}

.action-btn.primary {
  background: var(--skoda-green);
  color: white;
  border-color: var(--skoda-green);
  font-weight: 700;
}

.action-btn.primary:hover {
  background: var(--skoda-green-dark);
  border-color: var(--skoda-green-dark);
  color: white;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.error-card {
  border-left: 4px solid #dc3545;
}

.error-header h3 {
  color: #dc3545;
  margin: 0;
}

.error-content {
  margin: 1rem 0;
}

.error-suggestions {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.error-suggestions ul {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}

.examples-section h3 {
  color: var(--skoda-green);
  margin-bottom: 1.5rem;
  text-align: center;
}

.conversion-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
}

.category h4 {
  color: var(--skoda-green);
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-examples {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-btn {
  background: white;
  color: #333;
  border: 2px solid #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.example-btn .hint {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

.fabia-facts {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--skoda-green-light);
}

.fabia-facts h4 {
  color: var(--skoda-green);
  margin-bottom: 1rem;
  text-align: center;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.spec-item {
  background: var(--skoda-green-light);
  color: var(--skoda-green);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--skoda-green);
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.example-btn {
  background: white;
  color: #333;
  border: 2px solid #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  text-align: center;
}

.example-btn:hover {
  border-color: var(--skoda-green);
  background: var(--skoda-green-light);
  color: var(--skoda-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.2);
}

.embed-dialog-overlay {
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

.embed-dialog {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.embed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.embed-header h3 {
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

.embed-content {
  padding: 1.5rem;
}

.embed-options {
  margin-bottom: 1.5rem;
}

.embed-options h4 {
  margin-bottom: 0.75rem;
  color: var(--skoda-green);
  font-size: 1rem;
}

.embed-type-selector {
  display: grid;
  gap: 0.5rem;
}

.embed-type-option {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.embed-type-option:hover {
  border-color: var(--skoda-green);
  background: #f8fff8;
}

.embed-type-option.active {
  border-color: var(--skoda-green);
  background: #e8f5e8;
}

.embed-type-option input[type="radio"] {
  margin-right: 0.5rem;
  margin-top: 0.125rem;
  width: auto;
  flex: 0 0 auto;
}

.option-content {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-description {
  font-size: 0.875rem;
  color: #666;
}

.embed-code-section {
  margin-bottom: 1rem;
}

.embed-code-section p {
  margin-bottom: 0.5rem;
  color: #333;
}

.embed-code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  width: 100%;
  resize: vertical;
}

.embed-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.embed-preview h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.preview-frame {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
}

.embed-actions {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.conversion-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  border-left: 4px solid var(--skoda-green);
}

.conversion-summary {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.fabia-result {
  color: var(--skoda-green);
  font-weight: bold;
  font-size: 1.2rem;
}

.calculation {
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-actions {
    justify-content: center;
  }
  
  .action-btn {
    flex: 1;
    min-width: 0;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .conversion-categories {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .category {
    padding: 0.75rem;
  }
  
  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .spec-item {
    font-size: 0.75rem;
    padding: 0.375rem;
  }
  
  .example-btn .hint {
    display: none;
  }
  
  .embed-dialog {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .embed-actions {
    flex-direction: column;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>