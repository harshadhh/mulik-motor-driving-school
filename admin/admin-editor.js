/* ================================================================
   MULIK MOTOR — WEBSITE EDITOR
   Full site editor — saves to localStorage, applies live to website
   Works forever, zero server needed, zero dependencies.
   ================================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mulik_site_settings';

  // ── Load current settings ──────────────────────────────────────
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  }

  // ── Save settings ─────────────────────────────────────────────
  function saveSettings(patch) {
    const current = loadSettings();
    const merged  = Object.assign(current, patch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  // ── Reset all settings ────────────────────────────────────────
  function resetSettings() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ── Fill editor form with current saved values ────────────────
  function populateEditor() {
    const s = loadSettings();
    document.querySelectorAll('[data-field]').forEach(input => {
      const key = input.getAttribute('data-field');
      if (s[key] !== undefined) {
        if (input.type === 'color') {
          // ensure 6-digit hex for color inputs
          input.value = s[key];
        } else {
          input.value = s[key];
        }
      }
      // Show live hex value next to color picker
      if (input.type === 'color') {
        const label = document.querySelector(`[data-hex="${key}"]`);
        if (label) label.textContent = input.value.toUpperCase();
      }
    });
  }

  // ── Live preview: open public site in iframe and apply changes ─
  function applyLivePreview(patch) {
    const preview = document.getElementById('sitePreviewFrame');
    if (!preview || !preview.contentWindow) return;
    try {
      const win = preview.contentWindow;
      if (win.MulikSettings) {
        win.MulikSettings.save(patch);
      }
    } catch (e) {
      // Cross-origin fallback — just save and let user refresh
    }
  }

  // ── Show save status ──────────────────────────────────────────
  function showEditorStatus(msg, type) {
    const el = document.getElementById('editorSaveStatus');
    if (!el) return;
    el.textContent   = msg;
    el.className     = `editor-save-status ${type}`;
    el.style.display = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.style.display = 'none'; }, 4000);
  }

  // ── Collect all editor form values into an object ─────────────
  function collectFormValues() {
    const result = {};
    document.querySelectorAll('[data-field]').forEach(input => {
      const key = input.getAttribute('data-field');
      result[key] = input.value;
    });
    return result;
  }

  // ── Handle section tab switching inside editor ────────────────
  function setupEditorTabs() {
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.editor-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panelId = tab.getAttribute('data-panel');
        const panel   = document.getElementById('epanel-' + panelId);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ── Color picker live update ──────────────────────────────────
  function setupColorPickers() {
    document.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      const key    = picker.getAttribute('data-field');
      const hexEl  = document.querySelector(`[data-hex="${key}"]`);

      picker.addEventListener('input', () => {
        if (hexEl) hexEl.textContent = picker.value.toUpperCase();
        // Live preview: patch just this color
        const patch = {};
        patch[key]  = picker.value;
        saveSettings(patch);
        applyLivePreview(patch);
      });
    });
  }

  // ── Font live update ──────────────────────────────────────────
  function setupFontSelects() {
    document.querySelectorAll('select[data-field]').forEach(select => {
      select.addEventListener('change', () => {
        const key    = select.getAttribute('data-field');
        const patch  = {};
        patch[key]   = select.value;
        saveSettings(patch);
        applyLivePreview(patch);
      });
    });
  }

  // ── Text field live update (debounced 600ms) ──────────────────
  function setupTextFields() {
    document.querySelectorAll('input[type="text"][data-field], input[type="tel"][data-field], textarea[data-field]').forEach(input => {
      let timer;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const key   = input.getAttribute('data-field');
          const patch = {};
          patch[key]  = input.value;
          saveSettings(patch);
          applyLivePreview(patch);
        }, 600);
      });
    });
  }

  // ── Save ALL button ───────────────────────────────────────────
  function setupSaveButton() {
    const btn = document.getElementById('saveAllEditorBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const all = collectFormValues();
      saveSettings(all);
      applyLivePreview(all);
      showEditorStatus('✅ All changes saved! Your website has been updated.', 'success');
      btn.textContent = '✅ Saved!';
      setTimeout(() => { btn.textContent = '💾 Save All Changes'; }, 3000);
    });
  }

  // ── Reset button ──────────────────────────────────────────────
  function setupResetButton() {
    const btn = document.getElementById('resetEditorBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('⚠️ This will reset ALL your website changes back to the original design. Are you sure?')) {
        resetSettings();
        populateEditor();
        showEditorStatus('🔄 Reset to original. Refresh your website to see changes.', 'error');
      }
    });
  }

  // ── Preview button ────────────────────────────────────────────
  function setupPreviewButton() {
    const btn = document.getElementById('openPreviewBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.open('../', '_blank');
    });
  }

  // ── Image upload via ImgBB free API ───────────────────────────
  // Users can get a free API key at imgbb.com (no credit card)
  function setupImageUploads() {
    document.querySelectorAll('.img-upload-input').forEach(input => {
      const key         = input.getAttribute('data-img-key');
      const preview     = document.querySelector(`[data-img-preview="${key}"]`);
      const statusEl    = document.querySelector(`[data-img-status="${key}"]`);
      const apiKeyInput = document.getElementById('imgbbApiKey');

      input.addEventListener('change', async () => {
        const file = input.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
          if (statusEl) { statusEl.textContent = '❌ Please select an image file.'; statusEl.style.color = 'red'; }
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          if (statusEl) { statusEl.textContent = '❌ Image too large. Max 5MB.'; statusEl.style.color = 'red'; }
          return;
        }

        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
        };
        reader.readAsDataURL(file);

        // Try ImgBB upload if API key is set
        const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        if (!apiKey) {
          // Save as base64 directly (works for logos, small images)
          const r2 = new FileReader();
          r2.onload = (e) => {
            const patch = {};
            patch[key]  = e.target.result;
            saveSettings(patch);
            applyLivePreview(patch);
            if (statusEl) { statusEl.textContent = '✅ Image saved!'; statusEl.style.color = 'green'; }
          };
          r2.readAsDataURL(file);
          return;
        }

        // Upload to ImgBB
        if (statusEl) { statusEl.textContent = '⏳ Uploading...'; statusEl.style.color = '#1976D2'; }
        try {
          const formData = new FormData();
          formData.append('image', file);
          const res  = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            const url   = data.data.url;
            const patch = {};
            patch[key]  = url;
            saveSettings(patch);
            applyLivePreview(patch);
            if (preview) { preview.src = url; preview.style.display = 'block'; }
            if (statusEl) { statusEl.textContent = '✅ Uploaded & saved!'; statusEl.style.color = 'green'; }
          } else {
            throw new Error('ImgBB error');
          }
        } catch (err) {
          // Fallback to base64
          const r3 = new FileReader();
          r3.onload = (e) => {
            const patch = {};
            patch[key]  = e.target.result;
            saveSettings(patch);
            applyLivePreview(patch);
            if (statusEl) { statusEl.textContent = '✅ Image saved locally!'; statusEl.style.color = 'green'; }
          };
          r3.readAsDataURL(file);
        }
      });
    });
  }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    populateEditor();
    setupEditorTabs();
    setupColorPickers();
    setupFontSelects();
    setupTextFields();
    setupSaveButton();
    setupResetButton();
    setupPreviewButton();
    setupImageUploads();

    // Show saved images in preview
    const s = loadSettings();
    ['logoUrl', 'heroImageUrl', 'trainer1Photo', 'trainer2Photo', 'trainer3Photo'].forEach(key => {
      if (s[key]) {
        const prev = document.querySelector(`[data-img-preview="${key}"]`);
        if (prev) { prev.src = s[key]; prev.style.display = 'block'; }
      }
    });
  }

  // Run when editor section is shown
  document.addEventListener('DOMContentLoaded', () => {
    // Init immediately if editor section visible
    if (document.getElementById('section-editor')) {
      init();
    }
  });

  // Also init when section is switched to
  window.initEditor = init;

})();
