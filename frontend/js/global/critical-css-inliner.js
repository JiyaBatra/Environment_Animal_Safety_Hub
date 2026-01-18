/**
 * Critical CSS Inliner for EcoLife
 *
 * Extracts and inlines critical CSS for faster first paint and improved
 * Core Web Vitals performance on the environmental platform.
 *
 * Features:
 * - Automatic critical CSS extraction
 * - Above-the-fold content optimization
 * - Media query handling for responsive design
 * - Font-face declaration inclusion
 * - Build script integration
 *
 * @class CriticalCSSInliner
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

class CriticalCSSInliner {
  constructor() {
    this.criticalSelectors = [
      // Layout and typography
      'body', 'html', '*', '*:before', '*:after',
      // Navbar
      '.navbar', '.nav-container', '.nav-links', '.nav-toggle',
      // Hero sections
      '.hero', '.hero-container', '.hero-text', '.hero-image',
      // Buttons and interactive elements
      '.btn-custom', '.btn-primary', '.btn-secondary',
      // Theme variables
      ':root', '[data-theme="dark"]', '.dark-mode',
      // Loading states
      '.loading', '.skeleton',
      // Accessibility
      '.sr-only', '.visually-hidden'
    ];
  }

  /**
   * Extract critical CSS from a CSS file
   * @param {string} cssContent - The full CSS content
   * @returns {string} - Critical CSS only
   */
  extractCritical(cssContent) {
    const rules = this.parseCSS(cssContent);
    const criticalRules = [];

    for (const rule of rules) {
      if (this.isCriticalRule(rule)) {
        criticalRules.push(rule);
      }
    }

    return criticalRules.join('\n');
  }

  /**
   * Parse CSS into individual rules
   * @param {string} css - CSS content
   * @returns {string[]} - Array of CSS rules
   */
  parseCSS(css) {
    const rules = [];
    let braceCount = 0;
    let currentRule = '';
    let inComment = false;

    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      const nextChar = css[i + 1] || '';

      // Handle comments
      if (char === '/' && nextChar === '*') {
        inComment = true;
      }
      if (char === '*' && nextChar === '/') {
        inComment = false;
        i++; // Skip next char
        continue;
      }

      if (inComment) continue;

      currentRule += char;

      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          rules.push(currentRule.trim());
          currentRule = '';
        }
      }
    }

    return rules;
  }

  /**
   * Check if a CSS rule is critical for above-the-fold content
   * @param {string} rule - CSS rule
   * @returns {boolean}
   */
  isCriticalRule(rule) {
    const selector = rule.split('{')[0].trim();

    // Check if selector matches critical selectors
    for (const criticalSelector of this.criticalSelectors) {
      if (selector.includes(criticalSelector) ||
          this.matchesPattern(selector, criticalSelector)) {
        return true;
      }
    }

    // Check for @media queries that might be critical
    if (rule.startsWith('@media')) {
      return this.isCriticalMediaQuery(rule);
    }

    // Check for font-face declarations
    if (rule.startsWith('@font-face')) {
      return true;
    }

    return false;
  }

  /**
   * Check if selector matches a pattern
   * @param {string} selector - CSS selector
   * @param {string} pattern - Pattern to match
   * @returns {boolean}
   */
  matchesPattern(selector, pattern) {
    // Simple pattern matching for classes and IDs
    if (pattern.startsWith('.')) {
      return selector.includes(pattern);
    }
    if (pattern.startsWith('#')) {
      return selector.includes(pattern);
    }
    return selector === pattern;
  }

  /**
   * Check if media query contains critical rules
   * @param {string} rule - Media query rule
   * @returns {boolean}
   */
  isCriticalMediaQuery(rule) {
    // Consider small screen media queries as critical
    return rule.includes('(max-width:') && (
      rule.includes('768px') ||
      rule.includes('480px') ||
      rule.includes('320px')
    );
  }

  /**
   * Generate HTML with inlined critical CSS
   * @param {string} html - Original HTML
   * @param {string} criticalCSS - Critical CSS to inline
   * @returns {string} - HTML with inlined CSS
   */
  inlineCriticalCSS(html, criticalCSS) {
    const styleTag = `<style>${criticalCSS}</style>`;
    return html.replace('<head>', `<head>${styleTag}`);
  }
}

// Export for use in build scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CriticalCSSInliner;
}