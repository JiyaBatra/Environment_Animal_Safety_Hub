/**
 * I18nManager - Internationalization Management for EcoLife
 * 
 * Handles loading translation files, provides translation functions,
 * and updates the DOM with translated content.
 * 
 * Features:
 * - Dynamic loading of JSON translation files
 * - DOM scanning and automatic translation of elements with data-i18n
 * - Support for nested keys (e.g., 'nav.home')
 * - Fallback to English if translation is missing
 * 
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

(function () {
    'use strict';

    let _translations = {};
    let _currentLanguage = 'en';
    const _fallbackLanguage = 'en';

    /**
     * Get the relative path prefix (same as in component-loader.js)
     */
    function getRelativePrefix() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            const pathParts = path.split('/');
            const pagesIndex = pathParts.indexOf('pages');
            if (pagesIndex !== -1 && pagesIndex < pathParts.length - 2) {
                return '../../';
            }
            return '../';
        }
        return '';
    }

    const prefix = getRelativePrefix();

    /**
     * Load translation file for a language
     * @param {string} lang - Language code
     */
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${prefix}i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load translations for ${lang}`);
            _translations = await response.ok ? await response.json() : {};
            _currentLanguage = lang;
            return true;
        } catch (error) {
            console.error(`[I18nManager] Error loading ${lang}:`, error);
            if (lang !== _fallbackLanguage) {
                return await loadTranslations(_fallbackLanguage);
            }
            return false;
        }
    }

    /**
     * Get translation by key
     * @param {string} key - Nested key like 'hero.title'
     * @returns {string} Translated text or key if not found
     */
    function t(key) {
        const keys = key.split('.');
        let value = _translations;

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }

        return value;
    }

    /**
     * Update all elements with data-i18n attribute
     */
    function updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                }
            } else if (el.hasAttribute('data-i18n-attr')) {
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, translation);
            } else {
                el.innerHTML = translation;
            }
        });

        // Update document title if applicable
        const pageTitle = document.querySelector('title[data-i18n]');
        if (pageTitle) {
            document.title = t(pageTitle.getAttribute('data-i18n'));
        }

        // Dispatch event that translation is done
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: _currentLanguage }
        }));
    }

    const I18nManager = {
        /**
         * Initialize I18n with current preference
         * @param {string} lang - Language code
         */
        async init(lang) {
            await loadTranslations(lang || 'en');
            updateDOM();

            // Subscribe to preference changes if PreferencesManager is available
            if (window.PreferencesManager) {
                window.PreferencesManager.subscribe('language', async (newLang) => {
                    await this.setLanguage(newLang);
                });
            }

            console.log(`%c🌐 I18nManager Initialized (${_currentLanguage})`, 'color: #3b82f6; font-weight: bold;');
        },

        /**
         * Set current language
         * @param {string} lang - Language code
         */
        async setLanguage(lang) {
            if (lang === _currentLanguage) return;
            const success = await loadTranslations(lang);
            if (success) {
                updateDOM();
            }
        },

        /**
         * Get current language
         */
        getLanguage() {
            return _currentLanguage;
        },

        /**
         * Translation function
         */
        t(key) {
            return t(key);
        },

        /**
         * Manually trigger DOM update
         */
        refresh() {
            updateDOM();
        }
    };

    // Expose globally
    window.I18nManager = I18nManager;
    window.t = I18nManager.t; // Helper shorcut

})();
