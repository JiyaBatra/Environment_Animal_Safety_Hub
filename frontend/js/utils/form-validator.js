class FormValidator {
  constructor() {
    this.rules = {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address (e.g., john@example.com)'
      },
      phone: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number (10-16 digits)'
      },
      name: {
        pattern: /^[a-zA-Z\s]{2,50}$/,
        message: 'Name should be 2-50 characters, letters only'
      },
      location: {
        pattern: /^.{3,100}$/,
        message: 'Location should be 3-100 characters'
      },
      required: {
        pattern: /^.+$/,
        message: 'This field is required'
      }
    };
    
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupRealTimeValidation();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
      this.setupFormInputs(form);
    });
  }

  setupFormInputs(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Add validation classes and structure
      this.setupInputValidation(input);
      
      // Real-time validation
      input.addEventListener('input', () => this.validateInput(input));
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('focus', () => this.clearValidationState(input));
    });
  }

  setupInputValidation(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    // Add error message container
    if (!formGroup.querySelector('.error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    // Add success message container
    if (!formGroup.querySelector('.success-message')) {
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      const errorMsg = formGroup.querySelector('.error-message');
      errorMsg.parentNode.insertBefore(successDiv, errorMsg.nextSibling);
    }

    // Add input formatting
    this.setupInputFormatting(input);
  }

  setupInputFormatting(input) {
    const type = input.type || input.name;
    
    switch(type) {
      case 'email':
        input.addEventListener('input', () => {
          input.value = input.value.toLowerCase().trim();
        });
        break;
        
      case 'phone':
        input.addEventListener('input', () => {
          // Remove non-digits except +
          let value = input.value.replace(/[^\d+]/g, '');
          // Format phone number
          if (value.length > 0 && !value.startsWith('+')) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
          }
          input.value = value;
        });
        break;
        
      case 'name':
        input.addEventListener('input', () => {
          // Capitalize first letter of each word
          input.value = input.value.replace(/\b\w/g, l => l.toUpperCase());
        });
        break;
    }
  }

  setupRealTimeValidation() {
    // Debounced validation for better performance
    this.validateDebounced = this.debounce((input) => {
      this.validateInput(input);
    }, 300);
  }

  validateInput(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup?.querySelector('.error-message');
    const successMsg = formGroup?.querySelector('.success-message');
    
    if (!formGroup || !errorMsg) return true;

    // Clear previous states
    this.clearValidationState(input);

    // Check required
    if (input.required && !value) {
      this.showError(input, this.rules.required.message);
      return false;
    }

    // Skip validation if empty and not required
    if (!value && !input.required) {
      return true;
    }

    // Validate based on input type/name
    const validationType = this.getValidationType(input);
    if (validationType && this.rules[validationType]) {
      const rule = this.rules[validationType];
      if (!rule.pattern.test(value)) {
        this.showError(input, rule.message);
        return false;
      }
    }

    // Show success
    this.showSuccess(input);
    return true;
  }

  getValidationType(input) {
    if (input.type === 'email') return 'email';
    if (input.name === 'phone' || input.type === 'tel') return 'phone';
    if (input.name === 'name') return 'name';
    if (input.name === 'location') return 'location';
    return null;
  }

  showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup?.querySelector('.error-message');
    
    input.classList.add('invalid');
    input.classList.remove('valid');
    
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    }

    // Announce to screen readers
    if (window.accessibilityManager) {
      window.accessibilityManager.announceFormError(input.name || 'field', message);
    }
  }

  showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const successMsg = formGroup?.querySelector('.success-message');
    
    input.classList.add('valid');
    input.classList.remove('invalid');
    
    if (successMsg) {
      successMsg.textContent = 'Looks good!';
      successMsg.style.display = 'block';
    }
  }

  clearValidationState(input) {
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup?.querySelector('.error-message');
    const successMsg = formGroup?.querySelector('.success-message');
    
    input.classList.remove('valid', 'invalid', 'validating');
    
    if (errorMsg) errorMsg.style.display = 'none';
    if (successMsg) successMsg.style.display = 'none';
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Validate all inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Focus first invalid input
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Show loading state
    this.showFormLoading(form);
    
    // Simulate form submission
    setTimeout(() => {
      this.showFormSuccess(form);
      
      // Announce success
      if (window.accessibilityManager) {
        window.accessibilityManager.announceFormSuccess('Form submitted successfully!');
      }
    }, 2000);
  }

  showFormLoading(form) {
    form.classList.add('form-submitting');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-label', 'Submitting form...');
    }
  }

  showFormSuccess(form) {
    form.classList.remove('form-submitting');
    form.innerHTML = `
      <div class="form-success">
        <h3>Thank you!</h3>
        <p>Your form has been submitted successfully. We'll get back to you soon.</p>
      </div>
    `;
  }

  // Utility function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize form validator
document.addEventListener('DOMContentLoaded', () => {
  window.formValidator = new FormValidator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}