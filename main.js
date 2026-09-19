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

  /* ---------- Suburb search filter ---------- */
  var suburbSearch = document.querySelector('.suburb-search input');
  if (suburbSearch) {
    suburbSearch.addEventListener('input', function () {
      var val = suburbSearch.value.trim().toLowerCase();
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

});
