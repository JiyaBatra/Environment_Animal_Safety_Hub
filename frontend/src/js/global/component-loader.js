/* ===== COMPONENT LOADER ===== */

/**
 * Loads HTML components dynamically and inserts them into the DOM
 * This improves separation of concerns by keeping HTML structure modular
 */
class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
  }

  /**
   * Registers a component with its selector and file path
   * @param {string} name - Component name identifier
   * @param {string} selector - CSS selector where component should be inserted
   * @param {string} filePath - Path to the HTML component file
   */
  registerComponent(name, selector, filePath) {
    this.components.set(name, { selector, filePath });
  }

  /**
   * Loads a single component and inserts it into the DOM
   * @param {string} name - Component name to load
   * @returns {Promise} - Resolves when component is loaded
   */
  async loadComponent(name) {
    if (this.loadedComponents.has(name)) {
      return Promise.resolve();
    }

    const component = this.components.get(name);
    if (!component) {
      console.warn(`Component "${name}" not registered`);
      return Promise.reject(new Error(`Component "${name}" not found`));
    }

    try {
      const response = await fetch(component.filePath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status}`);
      }

      const html = await response.text();
      const element = document.querySelector(component.selector);

      if (element) {
        element.innerHTML = html;
        this.loadedComponents.add(name);
      } else {
        console.warn(`Selector "${component.selector}" not found for component "${name}"`);
      }
    } catch (error) {
      console.error(`Error loading component "${name}":`, error);
    }
  }

  /**
   * Loads multiple components in parallel
   * @param {string[]} componentNames - Array of component names to load
   * @returns {Promise} - Resolves when all components are loaded
   */
  async loadComponents(componentNames) {
    const loadPromises = componentNames.map(name => this.loadComponent(name));
    return Promise.all(loadPromises);
  }

  /**
   * Loads all registered components
   * @returns {Promise} - Resolves when all components are loaded
   */
  async loadAllComponents() {
    const componentNames = Array.from(this.components.keys());
    return this.loadComponents(componentNames);
  }
}

// Create global component loader instance
const componentLoader = new ComponentLoader();

// Register all components
componentLoader.registerComponent('navbar', '#navbar-container', 'components/navbar.html');
componentLoader.registerComponent('hero', '#hero-container', 'components/hero.html');
componentLoader.registerComponent('footer', '#footer-container', 'components/footer.html');

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await componentLoader.loadAllComponents();
    // Dispatch custom event when all components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  } catch (error) {
    console.error('Error loading components:', error);
  }
});