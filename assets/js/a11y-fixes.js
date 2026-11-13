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
  // F3:
  ready(() => {
    // WCAG 2.1.1, 4.1.2: retain the existing click behavior and expose its state.
    const toggle = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.setAttribute('role', 'button'); toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', 'Toggle navigation menu'); toggle.setAttribute('aria-controls', 'sidebar');
    const sync = () => toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('expanded')));
    sync(); new MutationObserver(sync).observe(sidebar, { attributes:true, attributeFilter:['class'] });
    toggle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle.click(); }
    });
  });
  /* @@FIXES@@ */
})();
