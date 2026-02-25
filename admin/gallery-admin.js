/* ================================================================
   MULIK MOTOR — GALLERY ADMIN
   Full gallery management: categories, upload, delete, captions.
   Stores everything in localStorage key: mulik_gallery_data
   Format: [{src, category, caption}, ...]
================================================================ */

(function () {
  'use strict';

  const GALLERY_KEY  = 'mulik_gallery_data';
  const SETTINGS_KEY = 'mulik_site_settings';

  // ── Data helpers ─────────────────────────────────────────────
  function getPhotos() {
    try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]'); } catch(e) { return []; }
  }
  function savePhotos(arr) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(arr));
  }
  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveSettings(patch) {
    var cur = getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(Object.assign(cur, patch)));
  }

  // ── State ─────────────────────────────────────────────────────
  var activeCategory = null;

  // ── Get unique categories from photo data ─────────────────────
  function getCategories() {
    var cats = [];
    getPhotos().forEach(function(p) {
      if (p.category && !cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }

  // ── Render category list ──────────────────────────────────────
  function renderCategories() {
    var list = document.getElementById('galleryCatList');
    if (!list) return;
    var cats   = getCategories();
    var photos = getPhotos();

    list.innerHTML = '';
    cats.forEach(function(cat) {
      var count = photos.filter(function(p) { return p.category === cat; }).length;
      var item  = document.createElement('div');
      item.className = 'gallery-cat-item' + (cat === activeCategory ? ' active' : '');
      item.innerHTML =
        '<span class="gallery-cat-name">📁 ' + cat + '</span>' +
        '<span class="gallery-cat-count">' + count + '</span>' +
        '<button class="gallery-cat-delete" title="Delete category &amp; all its photos" data-cat="' + cat + '">🗑</button>';

      item.addEventListener('click', function(e) {
        if (e.target.classList.contains('gallery-cat-delete')) return;
        activeCategory = cat;
        renderCategories();
        renderPhotoGrid();
        document.getElementById('activeCatLabel').textContent = cat;
        document.getElementById('galleryUploadZone').style.display = '';
      });

      item.querySelector('.gallery-cat-delete').addEventListener('click', function(e) {
        e.stopPropagation();
        if (!confirm('Delete category "' + cat + '" and ALL ' + count + ' photos in it?')) return;
        var photos = getPhotos().filter(function(p) { return p.category !== cat; });
        savePhotos(photos);
        if (activeCategory === cat) {
          activeCategory = null;
          document.getElementById('activeCatLabel').textContent = 'Select a category →';
          document.getElementById('galleryUploadZone').style.display = 'none';
        }
        renderCategories();
        renderPhotoGrid();
      });

      list.appendChild(item);
    });

    if (!cats.length) {
      list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">No categories yet.<br/>Create one below 👇</div>';
    }
  }

  // ── Render photo grid ─────────────────────────────────────────
  function renderPhotoGrid() {
    var grid = document.getElementById('galleryPhotoGrid');
    if (!grid) return;
    var hint = document.getElementById('gallerySelectHint');

    if (!activeCategory) {
      grid.innerHTML = '';
      if (hint) { hint.style.display = ''; grid.appendChild(hint); }
      return;
    }

    grid.innerHTML = '';
    var photos = getPhotos().filter(function(p) { return p.category === activeCategory; });

    if (!photos.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">📷 No photos yet. Upload some above!</div>';
      return;
    }

    photos.forEach(function(photo, localIdx) {
      // Find global index
      var allPhotos = getPhotos();
      var globalIdx = allPhotos.findIndex(function(p) { return p.src === photo.src && p.category === photo.category; });

      var thumb = document.createElement('div');
      thumb.className = 'gallery-thumb';
      thumb.innerHTML =
        '<img src="' + photo.src + '" alt="' + (photo.caption || '') + '" loading="lazy" />' +
        '<div class="gallery-thumb-overlay">' +
          '<button class="gallery-thumb-delete" title="Delete photo" data-idx="' + globalIdx + '">🗑</button>' +
        '</div>' +
        '<input class="gallery-thumb-caption-input" type="text" placeholder="Add caption..." value="' + (photo.caption || '') + '" data-idx="' + globalIdx + '" title="Caption (shown on hover)" />';

      // Delete button
      thumb.querySelector('.gallery-thumb-delete').addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        if (!confirm('Delete this photo?')) return;
        var arr = getPhotos();
        arr.splice(idx, 1);
        savePhotos(arr);
        renderCategories();
        renderPhotoGrid();
      });

      // Caption input (auto-save on blur)
      thumb.querySelector('.gallery-thumb-caption-input').addEventListener('blur', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        var arr = getPhotos();
        if (arr[idx]) { arr[idx].caption = this.value; savePhotos(arr); }
      });
      // Stop click on input from triggering other things
      thumb.querySelector('.gallery-thumb-caption-input').addEventListener('click', function(e) { e.stopPropagation(); });

      grid.appendChild(thumb);
    });
  }

  // ── Handle file uploads ───────────────────────────────────────
  function setupFileUpload() {
    var input    = document.getElementById('galleryFileInput');
    var progress = document.getElementById('galleryUploadProgress');
    var fill     = document.getElementById('galleryProgressFill');
    var text     = document.getElementById('galleryProgressText');
    if (!input) return;

    input.addEventListener('change', function() {
      var files = Array.from(input.files);
      if (!files.length || !activeCategory) return;
      progress.style.display = 'block';

      var total = files.length;
      var done  = 0;

      function processNext() {
        if (done >= files.length) {
          fill.style.width = '100%';
          text.textContent = '✅ ' + total + ' photo' + (total > 1 ? 's' : '') + ' uploaded!';
          setTimeout(function() {
            progress.style.display = 'none';
            fill.style.width = '0%';
          }, 2000);
          renderCategories();
          renderPhotoGrid();
          input.value = '';
          return;
        }

        var file   = files[done];
        var reader = new FileReader();
        reader.onload = function(e) {
          var photos = getPhotos();
          photos.push({ src: e.target.result, category: activeCategory, caption: '' });
          savePhotos(photos);
          done++;
          var pct = Math.round((done / total) * 100);
          fill.style.width = pct + '%';
          text.textContent = 'Uploading ' + done + ' of ' + total + '...';
          processNext();
        };
        reader.readAsDataURL(file);
      }
      processNext();
    });
  }

  // ── Add category ──────────────────────────────────────────────
  function setupAddCategory() {
    var input = document.getElementById('newCatInput');
    var btn   = document.getElementById('addCatBtn');
    if (!input || !btn) return;

    function addCat() {
      var name = input.value.trim();
      if (!name) return;
      // Category is implicit — just set it active (photos will create it)
      var cats = getCategories();
      if (cats.includes(name)) {
        // Just switch to it
        activeCategory = name;
      } else {
        // Add a placeholder entry so category appears in list, then remove on first real photo
        // Actually: just set activeCategory and the upload will create it
        activeCategory = name;
      }
      input.value = '';
      renderCategories();
      renderPhotoGrid();
      document.getElementById('activeCatLabel').textContent = name;
      document.getElementById('galleryUploadZone').style.display = '';
    }

    btn.addEventListener('click', addCat);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') addCat(); });
  }

  // ── Hero image upload ──────────────────────────────────────────
  function setupHeroImageUpload() {
    var input      = document.getElementById('heroImgFileInput');
    var preview    = document.getElementById('heroImgPreview');
    var previewWrap= document.getElementById('heroImgPreviewWrap');
    var uploadZone = document.getElementById('heroImgUploadZone');
    var removeBtn  = document.getElementById('heroImgRemoveBtn');
    if (!input) return;

    // Load existing
    var s = getSettings();
    if (s.heroPhotoUrl) {
      preview.src = s.heroPhotoUrl;
      previewWrap.style.display = 'block';
      uploadZone.style.display = 'none';
    }

    input.addEventListener('change', function() {
      var file = input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        saveSettings({ heroPhotoUrl: e.target.result });
        preview.src = e.target.result;
        previewWrap.style.display = 'block';
        uploadZone.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        if (!confirm('Remove hero photo and show the car illustration instead?')) return;
        saveSettings({ heroPhotoUrl: '' });
        previewWrap.style.display = 'none';
        uploadZone.style.display = '';
        preview.src = '';
        input.value = '';
      });
    }
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    renderCategories();
    renderPhotoGrid();
    setupFileUpload();
    setupAddCategory();
    setupHeroImageUpload();
  }

  window.initGalleryAdmin = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
