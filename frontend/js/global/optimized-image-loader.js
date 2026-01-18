/**
 * Optimized Image Loading System for EcoLife
 * Implements WebP/AVIF support, lazy loading, and responsive images
 */

class OptimizedImageLoader {
  constructor() {
    this.supportsWebP = null;
    this.supportsAVIF = null;
    this.intersectionObserver = null;
    this.init();
  }

  async init() {
    await this.detectFormatSupport();
    this.setupIntersectionObserver();
    this.convertExistingImages();
  }

  /**
   * Detect browser support for modern image formats
   */
  async detectFormatSupport() {
    // Test WebP support
    const webpTest = new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    });

    // Test AVIF support
    const avifTest = new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });

    this.supportsWebP = await webpTest;
    this.supportsAVIF = await avifTest;

    console.log(`Image format support - WebP: ${this.supportsWebP}, AVIF: ${this.supportsAVIF}`);
  }

  /**
   * Setup intersection observer for lazy loading
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.intersectionObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.01
      });
    }
  }

  /**
   * Convert existing img tags to use optimized loading
   */
  convertExistingImages() {
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');
    images.forEach(img => {
      this.prepareLazyImage(img);
    });
  }

  /**
   * Prepare an image for lazy loading
   * @param {HTMLImageElement} img - Image element
   */
  prepareLazyImage(img) {
    // Add loading class
    img.classList.add('lazy-loading');

    // Set up placeholder
    if (!img.src || img.src === '') {
      img.src = this.getPlaceholder(img.dataset.width || 400, img.dataset.height || 300);
    }

    // Observe for lazy loading
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  /**
   * Load the actual image
   * @param {HTMLImageElement} img - Image element
   */
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src && !srcset) return;

    // Create optimized source
    const optimizedSrc = this.getOptimizedSrc(src);
    const optimizedSrcset = srcset ? this.getOptimizedSrcset(srcset) : null;

    // Set up load event
    img.addEventListener('load', () => {
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
    });

    img.addEventListener('error', () => {
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      // Fallback to original src
      if (src) img.src = src;
    });

    // Load the image
    if (optimizedSrcset) {
      img.srcset = optimizedSrcset;
    }
    if (optimizedSrc) {
      img.src = optimizedSrc;
    }
  }

  /**
   * Get optimized image source with format fallbacks
   * @param {string} src - Original source
   * @returns {string} - Optimized source
   */
  getOptimizedSrc(src) {
    if (!src) return src;

    // Convert to modern formats if supported
    if (this.supportsAVIF && src.match(/\.(jpg|jpeg|png)$/i)) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    } else if (this.supportsWebP && src.match(/\.(jpg|jpeg|png)$/i)) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    return src;
  }

  /**
   * Get optimized srcset with format fallbacks
   * @param {string} srcset - Original srcset
   * @returns {string} - Optimized srcset
   */
  getOptimizedSrcset(srcset) {
    if (!srcset) return srcset;

    const sources = srcset.split(',').map(source => {
      const [url, descriptor] = source.trim().split(' ');
      const optimizedUrl = this.getOptimizedSrc(url.trim());
      return descriptor ? `${optimizedUrl} ${descriptor}` : optimizedUrl;
    });

    return sources.join(', ');
  }

  /**
   * Generate a placeholder image
   * @param {number} width - Placeholder width
   * @param {number} height - Placeholder height
   * @returns {string} - Data URL for placeholder
   */
  getPlaceholder(width, height) {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#999" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Preload critical images
   * @param {string[]} urls - Array of image URLs to preload
   */
  preloadCriticalImages(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.getOptimizedSrc(url);
      document.head.appendChild(link);
    });
  }

  /**
   * Create responsive image element
   * @param {Object} options - Image options
   * @returns {HTMLPictureElement} - Picture element with sources
   */
  createResponsiveImage(options) {
    const {
      src,
      alt,
      sizes = '100vw',
      srcset,
      className = '',
      loading = 'lazy',
      width,
      height
    } = options;

    const picture = document.createElement('picture');

    // AVIF source (highest priority)
    if (this.supportsAVIF !== false) {
      const avifSource = document.createElement('source');
      avifSource.srcset = this.getOptimizedSrcset(srcset || src.replace(/\.(jpg|jpeg|png)$/i, '.avif'));
      avifSource.type = 'image/avif';
      picture.appendChild(avifSource);
    }

    // WebP source
    if (this.supportsWebP !== false) {
      const webpSource = document.createElement('source');
      webpSource.srcset = this.getOptimizedSrcset(srcset || src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      webpSource.type = 'image/webp';
      picture.appendChild(webpSource);
    }

    // Fallback img
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (sizes) img.sizes = sizes;
    if (srcset) img.srcset = srcset;
    if (className) img.className = className;
    if (loading) img.loading = loading;
    if (width) img.width = width;
    if (height) img.height = height;

    picture.appendChild(img);
    return picture;
  }
}

// Initialize on page load
let imageLoader;
document.addEventListener('DOMContentLoaded', () => {
  imageLoader = new OptimizedImageLoader();
});

// Export for global use
window.OptimizedImageLoader = OptimizedImageLoader;