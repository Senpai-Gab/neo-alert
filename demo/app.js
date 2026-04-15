/**
 * NEO ALERT — Demo & Documentation Logic
 * demo/app.js
 */

/* ─────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────── */
function switchTab(groupId, paneId, btn) {
  // Deactivate all tabs in this group
  var tabRow = document.getElementById(groupId);
  tabRow.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('on'); });
  // Hide all sibling panes (next siblings of the tab row's parent's children)
  var shell = tabRow.closest('.code-shell');
  shell.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('on'); });
  // Activate clicked tab + target pane
  btn.classList.add('on');
  document.getElementById(paneId).classList.add('on');
}

function copyBlock(btn) {
  var pre = btn.closest('.code-block').querySelector('pre');
  var text = pre ? pre.innerText : '';
  navigator.clipboard.writeText(text).then(function () {
    btn.textContent = 'Copied!';
    btn.classList.add('ok');
    setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 2000);
  });
}

function copyEl(elId) {
  var el = document.getElementById(elId);
  var text = el ? (el.innerText || el.textContent) : '';
  var copyBtnId = elId === 'tgen-pre' ? 'tgen-copy' : 'gen-copy';
  navigator.clipboard.writeText(text).then(function () {
    var btn = document.getElementById(copyBtnId);
    if (btn) { btn.textContent = 'Copied!'; btn.classList.add('ok'); setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 2000); }
  });
}

/* ─────────────────────────────────────────
   NAVBAR ACTIVE SCROLL
───────────────────────────────────────── */
var NAV_SECTIONS = ['install', 'demo', 'themes', 'builder', 'api', 'features'];

window.addEventListener('scroll', function () {
  var current = 'install';
  NAV_SECTIONS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 130) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ─────────────────────────────────────────
   QUICK DEMO
───────────────────────────────────────── */
var POS_CLASS_MAP = {
  'top-right': 'neo-pos-tr',
  'top-left':  'neo-pos-tl',
  'bottom-right': 'neo-pos-br',
  'bottom-left':  'neo-pos-bl'
};

function getDemoOpts() {
  return {
    position:     document.getElementById('q-pos').value,
    duration:     parseInt(document.getElementById('q-dur').value) || 0,
    showProgress: document.getElementById('q-prog').checked,
    pauseOnHover: document.getElementById('q-hover').checked,
    draggable:    document.getElementById('q-drag').checked,
  };
}

function syncRootPos() {
  var pos = document.getElementById('q-pos').value;
  var root = document.getElementById('neo-alert-root');
  if (root) root.className = POS_CLASS_MAP[pos] || 'neo-pos-tr';
}

document.getElementById('qb-s').addEventListener('click', function () {
  neoAlert.success('Changes saved!', Object.assign({ message: 'All your work has been persisted.' }, getDemoOpts()));
});
document.getElementById('qb-e').addEventListener('click', function () {
  neoAlert.error('Action failed', Object.assign({ message: 'Could not connect to the server.' }, getDemoOpts()));
});
document.getElementById('qb-w').addEventListener('click', function () {
  neoAlert.warning('Disk usage at 89%', Object.assign({ message: 'Consider clearing some space.' }, getDemoOpts()));
});
document.getElementById('qb-i').addEventListener('click', function () {
  neoAlert.info('Update v2.4.0 ready', Object.assign({ message: 'New features are available.' }, getDemoOpts()));
});
document.getElementById('qb-custom').addEventListener('click', function () {
  neoAlert(Object.assign({ type: 'success', title: 'Upload complete', message: '3 files · 2.4 MB in 1.2s' }, getDemoOpts()));
});
document.getElementById('qb-promise').addEventListener('click', function () {
  var pos = document.getElementById('q-pos').value;
  neoAlert.configure({ position: pos });
  var fakeOp = new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (Math.random() > 0.3) resolve({ name: 'design.figma' });
      else reject(new Error('Network timeout'));
    }, 2200);
  });
  neoAlert.promise(fakeOp, {
    loading: 'Uploading to cloud…',
    success: function (d) { return 'Uploaded ' + d.name + '!'; },
    error:   function (e) { return 'Upload failed: ' + e.message; },
  });
});

/* ─────────────────────────────────────────
   THEME PRESETS
───────────────────────────────────────── */
var THEMES = [
  {
    id: 'dark-glass', name: 'Dark Glass', desc: 'Default — deep navy glassmorphism',
    preview: { bg: 'rgba(13,18,32,0.88)', border: 'rgba(56,189,248,0.22)', iconBg: 'rgba(56,189,248,0.15)', iconColor: '#38bdf8', title: '#dde3f0', msg: 'rgba(221,227,240,0.58)' },
    theme: { background: 'rgba(13,18,32,0.88)', borderColor: 'rgba(56,189,248,0.22)', iconBackground: 'rgba(56,189,248,0.15)', iconColor: '#38bdf8', titleColor: '#dde3f0', messageColor: 'rgba(221,227,240,0.58)', borderRadius: '14px', backdropBlur: 'blur(22px)', shadow: '0 4px 20px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)', progressColor: '#38bdf8' }
  },
  {
    id: 'light-frost', name: 'Light Frost', desc: 'Clean white glass for light UIs',
    preview: { bg: 'rgba(255,255,255,0.88)', border: 'rgba(0,0,0,0.1)', iconBg: 'rgba(34,211,160,0.12)', iconColor: '#0e9460', title: '#1a202c', msg: 'rgba(26,32,44,0.58)' },
    theme: { background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(0,0,0,0.1)', iconBackground: 'rgba(34,211,160,0.12)', iconColor: '#0e9460', titleColor: '#1a202c', messageColor: 'rgba(26,32,44,0.58)', borderRadius: '14px', backdropBlur: 'blur(20px)', shadow: '0 4px 24px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05)', progressColor: '#0e9460' }
  },
  {
    id: 'ocean', name: 'Ocean Depth', desc: 'Deep teal waves, translucent',
    preview: { bg: 'rgba(3,30,48,0.9)', border: 'rgba(6,182,212,0.28)', iconBg: 'rgba(6,182,212,0.14)', iconColor: '#22d3ee', title: '#ecfeff', msg: 'rgba(236,254,255,0.55)' },
    theme: { background: 'rgba(3,30,48,0.9)', borderColor: 'rgba(6,182,212,0.28)', iconBackground: 'rgba(6,182,212,0.14)', iconColor: '#22d3ee', titleColor: '#ecfeff', messageColor: 'rgba(236,254,255,0.55)', borderRadius: '18px', backdropBlur: 'blur(28px)', shadow: '0 4px 28px rgba(0,60,80,.4),inset 0 1px 0 rgba(255,255,255,.05)', progressColor: '#22d3ee' }
  },
  {
    id: 'ember', name: 'Ember', desc: 'Warm amber & deep charcoal',
    preview: { bg: 'rgba(28,16,4,0.9)', border: 'rgba(245,158,11,0.28)', iconBg: 'rgba(245,158,11,0.14)', iconColor: '#fbbf24', title: '#fef9ee', msg: 'rgba(254,249,238,0.55)' },
    theme: { background: 'rgba(28,16,4,0.9)', borderColor: 'rgba(245,158,11,0.28)', iconBackground: 'rgba(245,158,11,0.14)', iconColor: '#fbbf24', titleColor: '#fef9ee', messageColor: 'rgba(254,249,238,0.55)', borderRadius: '12px', backdropBlur: 'blur(18px)', shadow: '0 4px 28px rgba(60,20,0,.4),inset 0 1px 0 rgba(255,200,50,.07)', progressColor: '#fbbf24' }
  },
  {
    id: 'forest', name: 'Forest', desc: 'Organic green, earthy depths',
    preview: { bg: 'rgba(5,22,12,0.9)', border: 'rgba(34,197,94,0.28)', iconBg: 'rgba(34,197,94,0.14)', iconColor: '#4ade80', title: '#f0fdf4', msg: 'rgba(240,253,244,0.55)' },
    theme: { background: 'rgba(5,22,12,0.9)', borderColor: 'rgba(34,197,94,0.28)', iconBackground: 'rgba(34,197,94,0.14)', iconColor: '#4ade80', titleColor: '#f0fdf4', messageColor: 'rgba(240,253,244,0.55)', borderRadius: '16px', backdropBlur: 'blur(20px)', shadow: '0 4px 28px rgba(0,40,10,.4),inset 0 1px 0 rgba(100,255,100,.05)', progressColor: '#4ade80' }
  },
  {
    id: 'royal', name: 'Royal', desc: 'Vivid violet, high contrast',
    preview: { bg: 'rgba(18,6,40,0.92)', border: 'rgba(167,139,250,0.3)', iconBg: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa', title: '#f3e8ff', msg: 'rgba(243,232,255,0.55)' },
    theme: { background: 'rgba(18,6,40,0.92)', borderColor: 'rgba(167,139,250,0.3)', iconBackground: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa', titleColor: '#f3e8ff', messageColor: 'rgba(243,232,255,0.55)', borderRadius: '16px', backdropBlur: 'blur(24px)', shadow: '0 4px 28px rgba(40,0,80,.4),inset 0 1px 0 rgba(200,150,255,.06)', progressColor: '#a78bfa' }
  },
];

var activeThemeId = 'dark-glass';

function renderThemes() {
  var grid = document.getElementById('themes-grid');
  grid.innerHTML = '';
  THEMES.forEach(function (t) {
    var p = t.preview;
    var card = document.createElement('div');
    card.className = 'theme-card' + (t.id === activeThemeId ? ' active' : '');
    card.innerHTML =
      '<div class="theme-preview" style="background:' + p.bg + ';border-color:' + p.border + '">' +
        '<div class="tp-icon" style="background:' + p.iconBg + ';color:' + p.iconColor + '">' +
          '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</div>' +
        '<div class="tp-body">' +
          '<div class="tp-title" style="color:' + p.title + '">Changes saved!</div>' +
          '<div class="tp-msg" style="color:' + p.msg + '">All data was persisted.</div>' +
        '</div>' +
      '</div>' +
      '<div><div class="theme-name">' + t.name + '</div><div class="theme-desc">' + t.desc + '</div></div>';
    card.addEventListener('click', function () { selectTheme(t.id); });
    grid.appendChild(card);
  });
  renderThemeCode(activeThemeId);
}

function selectTheme(id) {
  activeThemeId = id;
  var t = THEMES.find(function (x) { return x.id === id; });
  neoAlert.success('Preview: ' + t.name, { message: t.desc, theme: t.theme, duration: 5000 });
  renderThemes();
}

function renderThemeCode(id) {
  var t = THEMES.find(function (x) { return x.id === id; });
  if (!t) return;
  document.getElementById('tgen-label').textContent = t.name + ' theme';
  var th = t.theme;
  var lines = [
    "<span class='fn'>neoAlert</span>.<span class='fn'>success</span>(<span class='str'>'Saved!'</span>, {",
    "  message: <span class='str'>'All changes persisted.'</span>,",
    "  theme: {",
    "    background:     <span class='str'>'" + th.background + "'</span>,",
    "    borderColor:    <span class='str'>'" + th.borderColor + "'</span>,",
    "    iconBackground: <span class='str'>'" + th.iconBackground + "'</span>,",
    "    iconColor:      <span class='str'>'" + th.iconColor + "'</span>,",
    "    titleColor:     <span class='str'>'" + th.titleColor + "'</span>,",
    "    messageColor:   <span class='str'>'" + th.messageColor + "'</span>,",
    "    borderRadius:   <span class='str'>'" + th.borderRadius + "'</span>,",
    "    backdropBlur:   <span class='str'>'" + th.backdropBlur + "'</span>,",
    "    shadow:         <span class='str'>'" + th.shadow + "'</span>,",
    "    progressColor:  <span class='str'>'" + th.progressColor + "'</span>,",
    "  }",
    "});",
  ];
  document.getElementById('tgen-pre').innerHTML = lines.join('\n');
}

/* ─────────────────────────────────────────
   CUSTOM BUILDER
───────────────────────────────────────── */
function syncColor(key, hex) {
  document.getElementById('cv-' + key).value = hex;
  updateBuilder();
}

function syncColorVal(key, val) {
  var hex = val.match(/#[0-9a-fA-F]{6}/);
  if (hex) document.getElementById('cp-' + key).value = hex[0];
  updateBuilder();
}

function getBuilderTheme() {
  var r = function (id) { return document.getElementById(id); };
  var radius  = r('b-radius').value + 'px';
  var blur    = 'blur(' + r('b-blur').value + 'px)';
  var width   = r('b-width').value + 'px';
  var sha     = parseInt(r('b-shadow').value) / 100;
  var shadow  = '0 4px ' + Math.round(sha * 20 + 4) + 'px rgba(0,0,0,' + (sha * 0.45 + 0.1).toFixed(2) + '),inset 0 1px 0 rgba(255,255,255,' + (sha * 0.08).toFixed(2) + ')';
  return {
    background:     r('cv-bg').value,
    borderColor:    r('cv-bd').value,
    titleColor:     r('cv-tc').value,
    messageColor:   r('cv-mc').value,
    iconBackground: r('cv-ib').value,
    iconColor:      r('cv-ic').value,
    borderRadius:   radius,
    backdropBlur:   blur,
    width:          width,
    shadow:         shadow,
  };
}

var ICON_SVG = {
  success: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  error:   '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  warning: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 3L14 13H2L8 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  info:    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.5v3M8 5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

function updateBuilder() {
  var r = function (id) { return document.getElementById(id); };
  r('rv-radius').textContent  = r('b-radius').value + 'px';
  r('rv-blur').textContent    = r('b-blur').value   + 'px';
  r('rv-width').textContent   = r('b-width').value  + 'px';
  r('rv-shadow').textContent  = r('b-shadow').value + '%';

  var type  = r('b-type').value;
  var title = r('b-title').value || 'Toast Title';
  var msg   = r('b-msg').value;
  var dur   = parseInt(r('b-dur').value) || 4000;
  var prog  = r('b-prog').checked;
  var pos   = r('b-pos').value;
  var theme = getBuilderTheme();

  renderBuilderPreview(type, title, msg, dur, prog, theme);
  renderGenCode(type, title, msg, dur, prog, pos, theme);
}

function renderBuilderPreview(type, title, msg, dur, prog, theme) {
  var stage = document.getElementById('bp-stage');
  stage.innerHTML = '';
  var el = document.createElement('div');
  el.style.cssText =
    'position:relative;display:flex;align-items:flex-start;gap:12px;' +
    'padding:14px 16px 12px;' +
    'border-radius:' + theme.borderRadius + ';' +
    'background:' + theme.background + ';' +
    'border:1px solid ' + theme.borderColor + ';' +
    'box-shadow:' + theme.shadow + ';' +
    'backdrop-filter:' + theme.backdropBlur + ';' +
    '-webkit-backdrop-filter:' + theme.backdropBlur + ';' +
    'width:' + theme.width + ';max-width:100%;' +
    "font-family:'Syne',sans-serif;transition:all .2s;";
  el.innerHTML =
    '<div style="flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:' + theme.iconBackground + ';color:' + theme.iconColor + '">' +
      (ICON_SVG[type] || ICON_SVG.info) +
    '</div>' +
    '<div style="flex:1;min-width:0">' +
      '<div style="font-size:13.5px;font-weight:600;color:' + theme.titleColor + ';letter-spacing:-.01em;margin-bottom:2px;line-height:1.3">' + title + '</div>' +
      (msg ? '<div style="font-size:12.5px;color:' + theme.messageColor + ';line-height:1.45;font-weight:400">' + msg + '</div>' : '') +
    '</div>' +
    '<div style="flex-shrink:0;width:22px;height:22px;border-radius:6px;background:transparent;border:none;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.28);margin-top:-1px">' +
      '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
    '</div>' +
    (prog && dur > 0 ? '<div style="position:absolute;bottom:0;left:0;height:2.5px;width:65%;border-radius:0 0 0 ' + theme.borderRadius + ';background:' + theme.iconColor + ';opacity:.8"></div>' : '');
  stage.appendChild(el);
}

function renderGenCode(type, title, msg, dur, prog, pos, theme) {
  var esc = function (s) { return String(s).replace(/'/g, "\\'"); };
  var lines = [
    "<span class='fn'>neoAlert</span>({",
    "  type:         <span class='str'>'" + type + "'</span>,",
    "  title:        <span class='str'>'" + esc(title) + "'</span>,",
    msg ? "  message:      <span class='str'>'" + esc(msg) + "'</span>," : null,
    "  position:     <span class='str'>'" + pos + "'</span>,",
    "  duration:     <span class='nm'>" + dur + "</span>,",
    "  showProgress: <span class='bool'>" + prog + "</span>,",
    "  theme: {",
    "    background:     <span class='str'>'" + theme.background + "'</span>,",
    "    borderColor:    <span class='str'>'" + theme.borderColor + "'</span>,",
    "    iconBackground: <span class='str'>'" + theme.iconBackground + "'</span>,",
    "    iconColor:      <span class='str'>'" + theme.iconColor + "'</span>,",
    "    titleColor:     <span class='str'>'" + theme.titleColor + "'</span>,",
    "    messageColor:   <span class='str'>'" + theme.messageColor + "'</span>,",
    "    borderRadius:   <span class='str'>'" + theme.borderRadius + "'</span>,",
    "    backdropBlur:   <span class='str'>'" + theme.backdropBlur + "'</span>,",
    "    width:          <span class='str'>'" + theme.width + "'</span>,",
    "    shadow:         <span class='str'>'" + theme.shadow + "'</span>,",
    "  }",
    "});",
  ].filter(function (l) { return l !== null; });
  document.getElementById('gen-pre').innerHTML = lines.join('\n');
}

function fireCustom() {
  var r = function (id) { return document.getElementById(id); };
  var pos   = r('b-pos').value;
  var theme = getBuilderTheme();
  var root  = document.getElementById('neo-alert-root');
  if (root) root.className = POS_CLASS_MAP[pos] || 'neo-pos-tr';
  neoAlert({
    type:         r('b-type').value,
    title:        r('b-title').value || 'Toast Title',
    message:      r('b-msg').value,
    position:     pos,
    duration:     parseInt(r('b-dur').value) || 4000,
    showProgress: r('b-prog').checked,
    theme:        theme,
  });
}

function resetBuilder() {
  var r = function (id) { return document.getElementById(id); };
  r('b-type').value    = 'info';
  r('b-pos').value     = 'top-right';
  r('b-title').value   = 'Upload complete';
  r('b-msg').value     = '3 files · 2.4 MB transferred.';
  r('b-dur').value     = '4000';
  r('b-prog').checked  = true;
  r('cv-bg').value     = 'rgba(13,18,32,0.82)';
  r('cv-bd').value     = 'rgba(56,189,248,0.28)';
  r('cv-tc').value     = '#dde3f0';
  r('cv-mc').value     = 'rgba(221,227,240,0.55)';
  r('cv-ib').value     = 'rgba(56,189,248,0.15)';
  r('cv-ic').value     = '#38bdf8';
  r('b-radius').value  = '14';
  r('b-blur').value    = '22';
  r('b-width').value   = '320';
  r('b-shadow').value  = '50';
  updateBuilder();
}

/* ─────────────────────────────────────────
   INITIALISE ON PAGE LOAD
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  renderThemes();
  updateBuilder();

  // Welcome toast
  setTimeout(function () {
    neoAlert.success('NEO ALERT is ready!', {
      message: 'Try the demo, themes, and builder above.',
      duration: 5000,
    });
  }, 600);
});
