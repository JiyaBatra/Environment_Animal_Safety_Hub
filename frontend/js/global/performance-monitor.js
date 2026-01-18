/**
 * Performance Monitoring for EcoLife
 * Tracks Core Web Vitals and loading performance
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.trackCoreWebVitals();
    this.trackResourceLoading();
    this.trackNavigationTiming();
    this.setupPerformanceObserver();
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.reportMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  /**
   * Track resource loading times
   */
  trackResourceLoading() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 1000) { // Log slow resources (>1s)
            console.warn(`Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Track navigation timing
   */
  trackNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
          this.metrics.totalTime = navigation.loadEventEnd - navigation.fetchStart;

          this.reportMetric('DOM Content Loaded', this.metrics.domContentLoaded);
          this.reportMetric('Load Complete', this.metrics.loadComplete);
          this.reportMetric('Total Load Time', this.metrics.totalTime);
        }
      }, 0);
    });
  }

  /**
   * Setup general performance observer
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * Report metric to console and potentially to analytics
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   */
  reportMetric(name, value) {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
    console.log(`📊 ${name}: ${formattedValue}ms`);

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value
      });
    }
  }

  /**
   * Get current performance metrics
   * @returns {Object} - Performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Check if performance meets targets
   * @returns {Object} - Performance assessment
   */
  assessPerformance() {
    const assessment = {
      lcp: this.metrics.lcp < 2500 ? 'good' : this.metrics.lcp < 4000 ? 'needs-improvement' : 'poor',
      fid: this.metrics.fid < 100 ? 'good' : this.metrics.fid < 300 ? 'needs-improvement' : 'poor',
      cls: this.metrics.cls < 0.1 ? 'good' : this.metrics.cls < 0.25 ? 'needs-improvement' : 'poor',
      totalLoadTime: this.metrics.totalTime < 3000 ? 'good' : this.metrics.totalTime < 5000 ? 'needs-improvement' : 'poor'
    };

    console.table(assessment);
    return assessment;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Make available globally
window.PerformanceMonitor = PerformanceMonitor;
window.performanceMonitor = performanceMonitor;