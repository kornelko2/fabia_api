<template>
  <div class="statistics-section">
    <div class="stats-header">
      <h3><AppIcon :icon="ChartColumnBig" :size="22" /> {{ $t('stats.title') }}</h3>
      <button @click="refreshStats" class="refresh-btn" :disabled="loading">
        <span :class="{ 'loading-spinner': loading }"><AppIcon :icon="RefreshCw" :size="16" /></span>
        {{ loading ? $t('stats.loading') : $t('stats.refresh') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !stats" class="loading-state">
      <div class="loading-spinner"><AppIcon :icon="RefreshCw" :size="24" /></div>
      <p>{{ $t('stats.loadingStats') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p><AppIcon :icon="CircleX" :size="16" /> {{ error }}</p>
      <button @click="refreshStats" class="retry-btn">{{ $t('common.tryAgain') }}</button>
    </div>

    <!-- Statistics Content -->
    <div v-if="stats && !loading" class="stats-content">
      <!-- Overview Cards -->
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-icon"><AppIcon :icon="Car" :size="32" /></div>
          <div class="stat-value">{{ stats.overview.totalUniqueConversions }}</div>
          <div class="stat-label">{{ $t('stats.uniqueConversions') }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"><AppIcon :icon="TrendingUp" :size="32" /></div>
          <div class="stat-value">{{ stats.overview.totalRequestsServed }}</div>
          <div class="stat-label">{{ $t('stats.totalRequestsServed') }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"><AppIcon :icon="Zap" :size="32" /></div>
          <div class="stat-value">{{ stats.overview.cacheHitRate }}</div>
          <div class="stat-label">{{ $t('stats.cacheHitRate') }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"><AppIcon :icon="RefreshCw" :size="32" /></div>
          <div class="stat-value">{{ stats.overview.averageReuseRate }}x</div>
          <div class="stat-label">{{ $t('stats.avgReuseRate') }}</div>
        </div>
      </div>

      <!-- Conversion Types -->
      <div class="stats-section-item">
        <h4><AppIcon :icon="Target" :size="18" /> {{ $t('stats.popularTypes') }}</h4>
        <div class="conversion-types">
          <div v-for="type in stats.conversionTypes" :key="type.measurement_type" class="type-item">
            <div class="type-info">
              <span class="type-name">{{ getTypeName(type.measurement_type) }}</span>
              <span class="type-icon"><AppIcon :icon="getTypeIcon(type.measurement_type)" :size="18" /></span>
            </div>
            <div class="type-stats">
              <span class="unique-count">{{ type.count }} {{ $t('stats.unique') }}</span>
              <span class="served-count">{{ type.total_served }} {{ $t('stats.served') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Conversions -->
      <div class="stats-section-item">
        <h4><AppIcon :icon="Clock" :size="18" /> {{ $t('stats.recentTitle') }}</h4>
        <div class="recent-conversions">
          <div 
            v-for="(conversion, index) in stats.recentConversions.slice(0, 5)" 
            :key="conversion.created_at" 
            class="conversion-item clickable"
            @click="showConversionDetails(conversion)"
          >
            <div class="conversion-rank">{{ index + 1 }}</div>
            <div class="conversion-input">
              <strong class="highlight-number">{{ formatNumber(conversion.measurement_value) }}</strong> {{ conversion.measurement_unit }}
              <span class="conversion-type">{{ getTypeName(conversion.measurement_type) }}</span>
            </div>
            <div class="conversion-arrow"><AppIcon :icon="ArrowRight" :size="20" /></div>
            <div class="conversion-result">
              <strong class="highlight-number fabia-count">{{ formatNumber(conversion.result_value) }}</strong> {{ $t('common.skodaFabias') }}
              <span class="usage-count" v-if="conversion.usage_count > 1">
                {{ $t('stats.used', { count: conversion.usage_count }) }}
              </span>
            </div>
            <div class="conversion-meta">
              <div class="conversion-language" :title="getLanguageName(conversion.language)">
                {{ getLanguageFlag(conversion.language) }}
              </div>
              <div class="conversion-time">
                {{ formatTime(conversion.created_at) }}
              </div>
              <div class="conversion-actions">
                <button class="mini-btn" @click.stop="shareConversion(conversion)" :title="$t('result.share')" :aria-label="$t('result.share')"><AppIcon :icon="Share2" :size="16" /></button>
                <button class="mini-btn" @click.stop="openEmbedDialog(conversion)" :title="$t('result.embedCode')" :aria-label="$t('result.embedCode')"><AppIcon :icon="Link2" :size="16" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Popular Conversions -->
      <div class="stats-section-item">
        <h4><AppIcon :icon="Trophy" :size="18" /> {{ $t('stats.mostRequested') }}</h4>
        <div class="popular-conversions">
          <div v-for="(conversion, index) in stats.popularConversions" :key="conversion.created_at" class="popular-item">
            <div class="rank">{{ index + 1 }}</div>
            <div class="popular-content">
              <div class="popular-conversion">
                <strong>{{ formatNumber(conversion.measurement_value) }} {{ conversion.measurement_unit }}</strong>
                <AppIcon :icon="ArrowRight" :size="16" /> <strong>{{ formatNumber(conversion.result_value) }} {{ $t('common.fabias') }}</strong>
              </div>
              <div class="popular-stats">
                <span class="usage-badge">{{ conversion.usage_count }} {{ $t('stats.requests') }}</span>
                <span class="type-badge">{{ getTypeName(conversion.measurement_type) }}</span>
                <span class="lang-badge" :title="getLanguageName(conversion.language)">{{ getLanguageFlag(conversion.language) }}</span>
              </div>
              <div class="popular-actions">
                <button class="mini-btn" @click.stop="shareConversion(conversion)" :title="$t('result.share')" :aria-label="$t('result.share')"><AppIcon :icon="Share2" :size="16" /></button>
                <button class="mini-btn" @click.stop="openEmbedDialog(conversion)" :title="$t('result.embedCode')" :aria-label="$t('result.embedCode')"><AppIcon :icon="Link2" :size="16" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Usage -->
      <div class="stats-section-item">
        <h4><AppIcon :icon="Globe" :size="18" /> {{ $t('stats.languageUsage') }}</h4>
        <div class="language-stats">
          <div v-for="lang in stats.languageUsage" :key="lang.language" class="language-item">
            <div class="language-info">
              <span class="language-flag">{{ getLanguageFlag(lang.language) }}</span>
              <span class="language-name">{{ getLanguageName(lang.language) }}</span>
            </div>
            <div class="language-numbers">
              <span class="unique-requests">{{ lang.count }} {{ $t('stats.unique') }}</span>
              <span class="total-requests">{{ lang.total_served }} {{ $t('stats.total') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Last Updated -->
      <div class="stats-footer">
        <small><AppIcon :icon="Calendar" :size="14" /> {{ $t('stats.lastUpdated', { time: formatTime(stats.lastUpdated) }) }}</small>
      </div>
    </div>
    
    <!-- Conversion Details Modal -->
    <div v-if="selectedConversion" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><AppIcon :icon="Car" :size="20" /> {{ $t('stats.detailsTitle') }}</h3>
          <button @click="closeModal" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h4>{{ $t('stats.input') }}</h4>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.value') }}</span>
              <span class="detail-value">{{ formatNumber(selectedConversion.measurement_value) }} {{ selectedConversion.measurement_unit }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.type') }}</span>
              <span class="detail-value">{{ getTypeName(selectedConversion.measurement_type) }} <AppIcon :icon="getTypeIcon(selectedConversion.measurement_type)" :size="16" /></span>
            </div>
          </div>

          <div class="detail-section">
            <h4>{{ $t('stats.result') }}</h4>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.skodaFabiasLabel') }}</span>
              <span class="detail-value fabia-result">{{ formatNumber(selectedConversion.result_value) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.calculation') }}</span>
              <span class="detail-value">
                {{ selectedConversion.measurement_value }} {{ selectedConversion.measurement_unit }} ÷
                {{ extractNumericReference(getFabiaReference(selectedConversion.measurement_type)) }} =
                {{ formatNumber(selectedConversion.result_value) }} {{ $t('common.fabias') }}
              </span>
            </div>
            <div class="detail-item" v-if="selectedConversion.ai_response">
              <span class="detail-label">{{ $t('stats.aiExplanation') }}</span>
              <span class="detail-value" style="white-space: pre-wrap; max-width: 520px; color: #333;">{{ selectedConversion.ai_response }}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>{{ $t('stats.usageStats') }}</h4>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.language') }}</span>
              <span class="detail-value">{{ getLanguageFlag(selectedConversion.language) }} {{ getLanguageName(selectedConversion.language) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.usedLabel') }}</span>
              <span class="detail-value">{{ selectedConversion.usage_count }}x</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.created') }}</span>
              <span class="detail-value">{{ formatTime(selectedConversion.created_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('stats.lastUsed') }}</span>
              <span class="detail-value">{{ formatTime(selectedConversion.last_used) }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">{{ $t('common.close') }}</button>
        </div>
      </div>
    </div>

    <!-- Embed Dialog for Stats -->
    <div v-if="showEmbedDialog" class="embed-dialog-overlay" @click="showEmbedDialog = false">
      <div class="embed-dialog" @click.stop>
        <div class="embed-header">
          <h3>{{ $t('embed.title') }}</h3>
          <button @click="showEmbedDialog = false" class="close-btn" :aria-label="$t('common.close')"><AppIcon :icon="X" /></button>
        </div>
        <div class="embed-content">
          <div class="embed-options">
            <h4>{{ $t('embed.type') }}</h4>
            <div class="embed-type-selector">
              <label v-for="type in embedTypes" :key="type.id" class="embed-type-option" :class="{ active: selectedEmbedType === type.id }">
                <input type="radio" :value="type.id" v-model="selectedEmbedType" @change="generateEmbedFromConversion(selectedConversion)" />
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
            <textarea v-model="embedCode" readonly rows="8" class="embed-code"></textarea>
          </div>
          <div class="embed-actions">
            <button class="btn-primary" @click="copyEmbed"><AppIcon :icon="Copy" :size="16" /> {{ $t('embed.copyCode') }}</button>
            <button class="btn-secondary" @click="showEmbedDialog = false">{{ $t('common.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChartColumnBig, RefreshCw, CircleX, Car, TrendingUp, Zap, Target, Clock,
  ArrowRight, Share2, Link2, Trophy, Globe, Calendar, Copy, X,
  Square, Scale, Ruler, Coins, MoveHorizontal, MoveVertical, Fuel
} from '@lucide/vue'
import AppIcon from './AppIcon.vue'

const TYPE_ICONS = {
  area: Square,
  weight: Scale,
  length: Ruler,
  price: Coins,
  width: MoveHorizontal,
  height: MoveVertical,
  power: Zap,
  consumption: Fuel
}

export default {
  name: 'Statistics',
  components: { AppIcon },
  setup() {
    return {
      ChartColumnBig, RefreshCw, CircleX, Car, TrendingUp, Zap, Target, Clock,
      ArrowRight, Share2, Link2, Trophy, Globe, Calendar, Copy, X
    }
  },
  data() {
    return {
      stats: null,
      loading: false,
      error: null,
      selectedConversion: null,
      showEmbedDialog: false,
      embedCode: '',
      selectedEmbedType: 'full'
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
    }
  },

  mounted() {
    this.refreshStats();
  },

  methods: {
    async refreshStats() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('https://skoda-fabia-api.kornelko.workers.dev/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        this.stats = await response.json();
      } catch (err) {
        this.error = err.message || 'Failed to load statistics';
        console.error('Stats error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    getTypeName(type) {
      const known = ['area', 'weight', 'length', 'price', 'width', 'height', 'power', 'consumption'];
      return known.includes(type) ? this.$t('types.' + type) : type;
    },
    
    getTypeIcon(type) {
      // Returns a Lucide icon *component* (not an emoji); render with
      // <AppIcon :icon="getTypeIcon(type)" />. Falls back to a chart icon.
      return TYPE_ICONS[type] || ChartColumnBig;
    },
    
    getFabiaReference(type) {
      const references = {
        'area': 'Škoda Fabia 1.2 HTP (64 HP): 6.587 m²',
        'weight': 'Škoda Fabia 1.2 HTP (64 HP): 1035 kg', 
        'length': 'Škoda Fabia 1.2 HTP (64 HP): 4.002 m',
        'price': 'Škoda Fabia 1.2 HTP: 16500 EUR',
        'width': 'Škoda Fabia 1.2 HTP (64 HP): 1.646 m',
        'height': 'Škoda Fabia 1.2 HTP (64 HP): 1.441 m',
        'power': 'Škoda Fabia 1.2 HTP (64 HP): 47 kW (64 HP)',
        'consumption': 'Škoda Fabia 1.2 HTP (64 HP): 5.9 L/100km'
      };
      return references[type] || 'N/A';
    },

    extractNumericReference(reference) {
      if (!reference) return 'N/A';
      // If the reference contains a colon, take the part after it. Otherwise return as is.
      const parts = String(reference).split(':');
      return parts.length > 1 ? parts.slice(1).join(':').trim() : reference;
    },
    
    showConversionDetails(conversion) {
      this.selectedConversion = conversion;
    },
    
    closeModal() {
      this.selectedConversion = null;
    },

    shareConversion(conv) {
      const text = `${this.formatNumber(conv.measurement_value)} ${conv.measurement_unit} → ${this.formatNumber(conv.result_value)} Škoda Fabias`;
      if (navigator.share) {
        navigator.share({ title: 'Fabia Conversion', text, url: window.location.href }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text + '\n' + window.location.href);
      }
    },

    openEmbedDialog(conv) {
      this.generateEmbedFromConversion(conv);
      this.showEmbedDialog = true;
    },

    generateEmbedFromConversion(conv) {
      const input = `${this.formatNumber(conv.measurement_value)} ${conv.measurement_unit}`;
      const conversionText = `${input} = ${this.formatNumber(conv.result_value)} Škoda Fabias`;
      const aiExplanation = conv.ai_response || '';
      const apiLink = `https://skoda-fabia-api.kornelko.workers.dev/stats`;
      let embedContent = '';
      switch (this.selectedEmbedType) {
        case 'full':
          embedContent = `<!-- Škoda Fabia Converter Embed - Full Result -->\n<div class="fabia-embed" style="border: 1px solid #00A651; padding: 1rem; border-radius: 8px; font-family: Arial, sans-serif; max-width: 500px; margin: 1rem 0; background: #f8fff8;">\n  <div style="font-weight: bold; margin-bottom: 0.5rem; color: #00A651;">\n    🚗 ${input}\n  </div>\n  <div style="color: #00A651; font-size: 1.1em; font-weight: bold; margin: 0.5rem 0; padding: 0.5rem; background: #e8f5e8; border-radius: 4px;">\n    ${conversionText}\n  </div>\n  ${aiExplanation ? `<div style="color: #333; font-size: 0.9em; line-height: 1.4; margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #00A651;">${aiExplanation.length > 200 ? aiExplanation.substring(0, 200) + '...' : aiExplanation}</div>` : ''}\n  <div style="font-size: 0.8em; color: #666; border-top: 1px solid #e0e0e0; padding-top: 0.5rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">\n    <span>Powered by <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">Škoda Fabia Converter</a></span>\n    <a href="${apiLink}" style="color: #00A651; text-decoration: none; font-size: 0.75em; padding: 0.25rem 0.5rem; border: 1px solid #00A651; border-radius: 3px;" title="View API data">📊 API</a>\n  </div>\n</div>`;
          break;
        case 'compact':
          embedContent = `<!-- Škoda Fabia Converter Embed - Compact -->\n<div class="fabia-embed" style="border: 1px solid #00A651; padding: 0.75rem; border-radius: 6px; font-family: Arial, sans-serif; max-width: 350px; margin: 1rem 0; background: #f8fff8;">\n  <div style="color: #00A651; font-weight: bold; margin-bottom: 0.25rem;">🚗 ${input}</div>\n  <div style="color: #00A651; font-size: 1em; font-weight: bold;">\n    ${conversionText}\n  </div>\n  <div style="font-size: 0.75em; color: #666; margin-top: 0.5rem; text-align: right;">\n    <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">Škoda Fabia Converter</a>\n  </div>\n</div>`;
          break;
        case 'calculation':
          embedContent = `<!-- Škoda Fabia Converter Embed - Calculation Only -->\n<div class="fabia-embed" style="border: 1px solid #00A651; padding: 0.5rem; border-radius: 4px; font-family: Arial, sans-serif; max-width: 300px; margin: 1rem 0; background: #e8f5e8; text-align: center;">\n  <div style="color: #00A651; font-weight: bold; font-size: 1.1em;">\n    ${conversionText}\n  </div>\n  <div style="font-size: 0.7em; color: #666; margin-top: 0.25rem;">\n    <a href="${window.location.href}" style="color: #00A651; text-decoration: none;">🚗 Fabia Converter</a>\n  </div>\n</div>`;
          break;
        case 'api':
          embedContent = `<!-- Škoda Fabia Converter API Link -->\n<div class="fabia-api-link" style="display: inline-block; padding: 0.5rem 1rem; background: #00A651; color: white; border-radius: 6px; font-family: Arial, sans-serif; text-decoration: none; margin: 0.5rem;">\n  <a href="${apiLink}" style="color: white; text-decoration: none; font-weight: bold;">\n    📊 View Conversion Data: ${input}\n  </a>\n</div>`;
          break;
      }
      this.embedCode = embedContent;
    },
    
    getLanguageFlag(language) {
      if (!language) {
        return '🌍';
      }
      
      const flags = {
        'czech': '🇨🇿',
        'slovak': '🇸🇰', 
        'hungarian': '🇭🇺',
        'polish': '🇵🇱',
        'english': '🇬🇧',
        'german': '🇩🇪',
        'spanish': '🇪🇸',
        'french': '🇫🇷'
      };
      
      const normalizedLang = language.toLowerCase().trim();
      return flags[normalizedLang] || '🌍';
    },
    
    getLanguageName(language) {
      const names = {
        'czech': 'Czech',
        'slovak': 'Slovak',
        'hungarian': 'Hungarian', 
        'polish': 'Polish',
        'english': 'English',
        'german': 'German',
        'spanish': 'Spanish',
        'french': 'French'
      };
      return names[language] || language;
    },
    
    formatNumber(num) {
      if (num === null || num === undefined) return '0';
      return Number(num).toLocaleString();
    },
    
    formatTime(timestamp) {
      if (!timestamp) return 'Unknown';
      return new Date(timestamp).toLocaleString();
    }
  }
}
</script>

<style scoped>
.statistics-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.stats-header h3 {
  margin: 0;
  color: var(--skoda-green);
  font-size: 1.5rem;
}

.refresh-btn {
  background: var(--skoda-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #008f42;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  display: inline-block;
  font-size: 1.5rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-state {
  color: #e53e3e;
}

.retry-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f8fff8, #e8f5e8);
  border: 1px solid var(--skoda-green);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 166, 81, 0.2);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--skoda-green);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stats-section-item {
  margin-bottom: 2rem;
}

.stats-section-item h4 {
  color: var(--skoda-green);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.conversion-types {
  display: grid;
  gap: 0.5rem;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid var(--skoda-green);
}

.type-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-name {
  font-weight: bold;
}

.type-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.recent-conversions {
  display: grid;
  gap: 1rem;
}

.conversion-item {
  display: grid;
  grid-template-columns: auto 2fr auto 2fr auto;
  align-items: center;
  padding: 1rem;
  background: #f8fff8;
  border-radius: 6px;
  border: 1px solid #e0f2e0;
  gap: 1rem;
  transition: all 0.3s ease;
}

.conversion-item.clickable {
  cursor: pointer;
}

.conversion-item.clickable:hover {
  background: #e8f5e8;
  border-color: var(--skoda-green);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 166, 81, 0.2);
}

.conversion-rank {
  background: var(--skoda-green);
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.conversion-input, .conversion-result {
  display: flex;
  flex-direction: column;
}

.conversion-type, .usage-count {
  font-size: 0.8rem;
  color: #666;
}

.conversion-arrow {
  color: var(--skoda-green);
  font-weight: bold;
  font-size: 1.2rem;
}

.conversion-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.8rem;
  color: #666;
}

.conversion-language {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  cursor: help;
}

.conversion-time {
  color: #999;
}

.highlight-number {
  color: #4CAF50;
  font-weight: 700;
  font-size: 1.1em;
}

.fabia-count {
  color: #2196F3;
}

.popular-conversions {
  display: grid;
  gap: 1rem;
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #fff9e6, #f0f9ff);
  border-radius: 6px;
  border: 1px solid #ffd700;
}

.rank {
  background: #ffd700;
  color: #333;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.conversion-actions, .popular-actions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
}
.mini-btn {
  border: 1px solid #e0e0e0;
  background: #fff;
  color: var(--skoda-green);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.mini-btn:hover { border-color: var(--skoda-green); background: var(--skoda-green-light); }

/* Embed dialog styles (reuse from ConversionForm) */
.embed-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.embed-dialog {
  background: #fff;
  width: 90%;
  max-width: 720px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
}
.embed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e0e0e0;
}
.embed-content { padding: 1.25rem; }
.embed-options { margin-bottom: 1rem; }
.embed-options h4 { margin-bottom: 0.5rem; color: var(--skoda-green); font-size: 1rem; }
.embed-type-selector { display: grid; gap: 0.5rem; }
.embed-type-option { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.5rem; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; background: #fff; }
.embed-type-option.active { border-color: var(--skoda-green); background: #f8fff8; }
.embed-type-option input[type="radio"] { margin: 0.25rem 0.25rem 0 0; width: auto; }
.option-content { flex: 1; }
.option-name { font-weight: 600; }
.option-description { font-size: 0.85rem; color: #666; }
.embed-preview { margin: 0.75rem 0 1rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0; }
.embed-preview h4 { margin-bottom: 0.5rem; color: #333; }
.preview-frame { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 1rem; }
.embed-code { width: 100%; min-height: 8rem; font-family: 'Courier New', monospace; background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 0.75rem; }
.embed-actions { display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 0.5rem; }

.popular-content {
  flex: 1;
}

.popular-conversion {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.popular-stats {
  display: flex;
  gap: 1rem;
}

.usage-badge, .type-badge {
  background: #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.usage-badge {
  background: var(--skoda-green);
  color: white;
}

.language-stats {
  display: grid;
  gap: 0.5rem;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.language-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-flag {
  font-size: 1.2rem;
}

.language-numbers {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.stats-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  color: var(--skoda-green);
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #333;
}

.detail-value {
  color: #666;
  text-align: right;
}

.detail-value.fabia-result {
  color: var(--skoda-green);
  font-weight: bold;
  font-size: 1.1rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .stats-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .conversion-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }
  
  .conversion-arrow {
    transform: rotate(90deg);
  }
  
  .popular-item {
    flex-direction: column;
    text-align: center;
  }
  
  .rank {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .language-item {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>