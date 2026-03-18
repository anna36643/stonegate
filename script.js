    // ─ Nav scroll
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ─ Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => observer.observe(el));

    // ─ Modal
    const modal = document.getElementById('ticket-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTop = document.getElementById('modal-top');
    const modalSuccess = document.getElementById('modal-success');

    function openModal(e) {
      e.preventDefault();
      // reset state
      modalBody.classList.remove('hidden');
      modalTop.classList.remove('hidden');
      modalSuccess.classList.remove('visible');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    document.getElementById('modal-submit').addEventListener('click', () => {
      const production = document.getElementById('field-production').value;
      const date = document.getElementById('field-date').value;
      const name = document.getElementById('field-name').value.trim();
      const email = document.getElementById('field-email').value.trim();

      if (!production || !date || !name || !email) {
        // simple shake on empty fields
        const emptyFields = [];
        if (!production) emptyFields.push('field-production');
        if (!date)       emptyFields.push('field-date');
        if (!name)       emptyFields.push('field-name');
        if (!email)      emptyFields.push('field-email');

        emptyFields.forEach(id => {
          const el = document.getElementById(id);
          el.style.borderColor = 'var(--blood-bright)';
          setTimeout(() => el.style.borderColor = '', 1500);
        });
        return;
      }

      // show success
      modalBody.classList.add('hidden');
      modalTop.classList.add('hidden');
      modalSuccess.classList.add('visible');

      setTimeout(closeModal, 3000);
    });

    // ─ Language switcher
    let currentLang = 'en';

    function setLang(lang) {
      currentLang = lang;
      document.getElementById('btn-en').classList.toggle('active', lang === 'en');
      document.getElementById('btn-pl').classList.toggle('active', lang === 'pl');

      document.querySelectorAll('[data-en], [data-pl]').forEach(el => {
        // section-heading — skip, children handle themselves
        if (el.id === 'season-heading') return;

        const text = el.getAttribute('data-' + lang);

        // attribute missing entirely — skip
        if (text === null) return;

        // empty string = clear element (e.g. "The " span in Polish)
        if (text === '') {
          el.textContent = '';
          return;
        }

        // About h2 — rebuild with <em>
        if (el.tagName === 'H2' && el.dataset.en && el.dataset.en.includes('old texts')) {
          el.innerHTML = lang === 'en'
            ? 'A theatre built on the conviction that <em>old texts ask new questions.</em>'
            : 'Teatr zbudowany na przekonaniu, że <em>stare teksty zadają nowe pytania.</em>';
          return;
        }

        // pf-date — update only first text node, leave <span> child alone
        if (el.classList.contains('pf-date')) {
          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = '\n              ' + text + '\n              ';
              break;
            }
          }
          return;
        }

        // OPTION elements
        if (el.tagName === 'OPTION') {
          el.textContent = text;
          return;
        }

        // btn-outline — has inner <span>, update the span instead
        if (el.classList.contains('btn-outline')) {
          const inner = el.querySelector('span');
          if (inner) inner.textContent = text;
          return;
        }

        // default — plain text swap
        el.textContent = text;
      });

      document.documentElement.lang = lang;
    }
