/* ============================================================
   HEALTH FOCUS NURSING & DISABILITY CARE
   Global JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 8) { nav.classList.add('scrolled'); }
      else { nav.classList.remove('scrolled'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Services tabs ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        var group = btn.closest('.tabs-group');
        if (!group) return;
        group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        group.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = group.querySelector('.tab-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---------- Long suburb lists: collapse on mobile ----------
     On small screens, lists longer than 12 suburbs show the first 12 plus
     a "Show all" button. Desktop always shows everything (CSS hides the
     button there). Searching bypasses the collapse so every match shows. */
  var CHIP_LIMIT = 12;
  document.querySelectorAll('.chip-grid').forEach(function (grid) {
    var total = grid.querySelectorAll('.chip').length;
    if (total <= CHIP_LIMIT) return;
    grid.classList.add('is-collapsed');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Show all ' + total + ' suburbs';
    grid.insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', function () {
      var collapsed = grid.classList.toggle('is-collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? 'Show all ' + total + ' suburbs' : 'Show fewer suburbs';
    });
  });

  /* ---------- Suburb search filter ---------- */
  var suburbSearch = document.querySelector('.suburb-search input');
  if (suburbSearch) {
    suburbSearch.addEventListener('input', function () {
      var val = suburbSearch.value.trim().toLowerCase();
      document.querySelectorAll('.chip-grid.collapsible').forEach(function (g) {
        g.classList.toggle('searching', val.length > 0);
      });
      document.querySelectorAll('.chip-grid').forEach(function (grid) {
        grid.classList.toggle('is-searching', val.length > 0);
      });
      document.querySelectorAll('.chip-grid .chip').forEach(function (chip) {
        var text = chip.textContent.trim().toLowerCase();
        chip.classList.toggle('hidden', val.length > 0 && text.indexOf(val) === -1);
      });
    });
  }

  /* ---------- Suburb chip click result ---------- */
  document.querySelectorAll('.chip[data-suburb-result]').forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      var resultBox = document.querySelector('.suburb-result');
      if (!resultBox) return;
      e.preventDefault();
      resultBox.textContent = 'We service ' + chip.getAttribute('data-suburb-result') + '. Enquire below to get started.';
      resultBox.classList.add('show');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  /* ---------- Multi-step hero / booking forms ---------- */
  document.querySelectorAll('.multistep-form').forEach(function (form) {
    var steps = form.querySelectorAll('.form-step');
    var dots = form.querySelectorAll('.step-dots span');
    var current = 0;
    var selections = {};

    function showStep(idx) {
      steps.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
      current = idx;
    }

    form.querySelectorAll('.choice-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.form-step');
        group.querySelectorAll('.choice-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selections[group.getAttribute('data-step-key') || group.dataset.step] = btn.getAttribute('data-value') || btn.textContent.trim();
        var continueBtn = group.querySelector('.btn-continue');
        if (continueBtn) continueBtn.disabled = false;
      });
    });

    form.querySelectorAll('.btn-continue').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        showStep(current + 1);
      });
    });

    form.querySelectorAll('.btn-back').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showStep(Math.max(0, current - 1));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var success = form.querySelector('.form-success');
      var body = form.querySelector('.form-body');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.classList.add('is-loading'); submitBtn.disabled = true; }
      var finish = function () {
        if (body) body.style.display = 'none';
        if (success) success.classList.add('active');
      };
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(finish).catch(finish);
    });

    if (steps.length) showStep(0);
  });

  /* ---------- Simple (non-stepped) forms: standard submit with success state ---------- */
  document.querySelectorAll('.simple-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var success = form.querySelector('.form-success');
      var body = form.querySelector('.form-body');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.classList.add('is-loading'); submitBtn.disabled = true; }
      var finish = function () {
        if (body) body.style.display = 'none';
        if (success) success.classList.add('active');
      };
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(finish).catch(finish);
    });
  });

  /* ---------- Role choice buttons on standard booking form (non-stepped) ---------- */
  document.querySelectorAll('.role-grid .choice-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.role-grid');
      group.querySelectorAll('.choice-btn').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      var hidden = group.parentElement.querySelector('input[name="role"]');
      if (hidden) hidden.value = btn.getAttribute('data-value') || btn.textContent.trim();
    });
  });

  /* ---------- Enquiry-type router ---------- */
  var routerBtns = document.querySelectorAll('.router-btn');
  if (routerBtns.length) {
    routerBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var role = btn.getAttribute('data-role');
        routerBtns.forEach(function (b) {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');

        document.querySelectorAll('.router-panel').forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-role') === role);
        });

        /* Pre-fill every role field on the page so the visitor never answers twice */
        document.querySelectorAll('input[name="role"]').forEach(function (input) {
          input.value = role;
        });
        document.querySelectorAll('.role-grid .choice-btn').forEach(function (b) {
          b.classList.toggle('selected', (b.getAttribute('data-value') || '') === role);
        });
        document.querySelectorAll('.multistep-form .form-step[data-step="role"] .choice-btn').forEach(function (b) {
          if ((b.getAttribute('data-value') || '') === role) { b.click(); }
        });
      });
    });
  }

  /* ---------- Progressive disclosure for NDIS item codes ---------- */
  document.querySelectorAll('.code-toggle').forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      target.style.maxHeight = open ? null : target.scrollHeight + 'px';
      var label = btn.querySelector('.code-toggle-label');
      if (label) label.textContent = open ? 'View NDIS item numbers' : 'Hide NDIS item numbers';
    });
  });

  /* ---------- Accessibility toolbar ---------- */
  (function () {
    var btn = document.querySelector('.a11y-btn');
    var panel = document.querySelector('.a11y-panel');
    if (!btn || !panel) return;
    var root = document.documentElement;
    var KEYS = ['size', 'contrast', 'links', 'motion'];

    function load() {
      KEYS.forEach(function (k) {
        var v = null;
        try { v = localStorage.getItem('a11y-' + k); } catch (e) { v = null; }
        if (v) root.setAttribute('data-a11y-' + k, v);
        syncButtons(k, v);
      });
    }
    function syncButtons(key, value) {
      panel.querySelectorAll('[data-a11y-key="' + key + '"]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-a11y-value') === value ? 'true' : 'false');
      });
    }
    function set(key, value) {
      if (value) {
        root.setAttribute('data-a11y-' + key, value);
        try { localStorage.setItem('a11y-' + key, value); } catch (e) {}
      } else {
        root.removeAttribute('data-a11y-' + key);
        try { localStorage.removeItem('a11y-' + key); } catch (e) {}
      }
      syncButtons(key, value);
    }

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.querySelectorAll('[data-a11y-key]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-a11y-key');
        var value = b.getAttribute('data-a11y-value');
        var current = root.getAttribute('data-a11y-' + key);
        set(key, current === value ? null : value);
      });
    });

    var reset = panel.querySelector('.a11y-reset');
    if (reset) {
      reset.addEventListener('click', function (e) {
        e.preventDefault();
        KEYS.forEach(function (k) { set(k, null); });
      });
    }

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    load();
  })();

  /* ---------- Nav dropdown ----------
     Desktop opening is handled entirely in CSS (:hover / :focus-within),
     so the menu still works if this script fails. JS only adds the
     tap-to-open behaviour needed on touch screens. */
  document.querySelectorAll('.has-drop').forEach(function (drop) {
    var toggle = drop.querySelector('.drop-toggle');
    if (!toggle) return;

    function setOpen(open) {
      drop.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(drop.getAttribute('aria-expanded') !== 'true');
    });

    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });

    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) setOpen(false);
    });
  });

  /* ---------- Show all suburbs (mobile) ---------- */
  document.querySelectorAll('.show-all-chips').forEach(function (btn) {
    var grid = btn.previousElementSibling;
    if (!grid || !grid.classList.contains('chip-grid')) return;
    var label = btn.querySelector('.label');
    var total = grid.querySelectorAll('.chip').length;
    if (label) label.textContent = 'Show all ' + total + ' suburbs';
    btn.addEventListener('click', function () {
      var open = grid.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Show fewer suburbs' : 'Show all ' + total + ' suburbs';
    });
  });

});
