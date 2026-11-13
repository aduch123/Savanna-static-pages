(function () {
  'use strict';
  function ready(callback) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  }
  // F2:
  ready(() => {
    // WCAG 2.1.1, 4.1.2: make the captured div dropdown keyboard operable.
    document.querySelectorAll('#student-switch-curriculum [data-bs-toggle="dropdown"]').forEach(toggle => {
      toggle.setAttribute('role', 'button'); toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.addEventListener('keydown', event => {
        if (event.target === toggle && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault(); toggle.click();
        }
      });
    });
  });
  /* @@FIXES@@ */
})();
