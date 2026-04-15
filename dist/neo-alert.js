/*!
 * NEO ALERT v1.0.0
 * A futuristic toast notification library
 * https://github.com/YOUR-USERNAME/neo-alert
 * MIT License
 */
(function (global, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.neoAlert = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';

  /* ─────────────────────────────────────────
     ICONS
  ───────────────────────────────────────── */
  var ICONS = {
    success: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:   '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    warning: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 3L14 13H2L8 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    info:    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.5v3M8 5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    loading: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="animation:neo-spin .8s linear infinite"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="24" stroke-dashoffset="8" stroke-linecap="round"/></svg>',
  };

  /* ─────────────────────────────────────────
     POSITION MAP
  ───────────────────────────────────────── */
  var POS_MAP = {
    'top-right':    'neo-pos-tr',
    'top-left':     'neo-pos-tl',
    'bottom-right': 'neo-pos-br',
    'bottom-left':  'neo-pos-bl',
  };

  /* ─────────────────────────────────────────
     DEFAULT CONFIG
  ───────────────────────────────────────── */
  var config = {
    position:     'top-right',
    duration:     4000,
    maxToasts:    6,
    pauseOnHover: true,
    showProgress: true,
    draggable:    true,
    gap:          10,
  };

  /* ─────────────────────────────────────────
     STATE
  ───────────────────────────────────────── */
  var toasts = new Map();
  var rootEl = null;
  var stylesInjected = false;

  /* ─────────────────────────────────────────
     STYLES (injected once into <head>)
  ───────────────────────────────────────── */
  var STYLES = [
    /* Root container */
    '#neo-alert-root{position:fixed;z-index:2147483647;pointer-events:none;',
    'display:flex;flex-direction:column;gap:10px;padding:20px;',
    'max-height:100vh;overflow:hidden;}',
    '#neo-alert-root .neo-toast{pointer-events:all;}',

    /* Positions */
    '#neo-alert-root.neo-pos-tr{top:0;right:0;align-items:flex-end;}',
    '#neo-alert-root.neo-pos-tl{top:0;left:0;align-items:flex-start;}',
    '#neo-alert-root.neo-pos-br{bottom:0;right:0;align-items:flex-end;flex-direction:column-reverse;}',
    '#neo-alert-root.neo-pos-bl{bottom:0;left:0;align-items:flex-start;flex-direction:column-reverse;}',

    /* Toast base */
    '.neo-toast{position:relative;width:320px;',
    'background:rgba(13,18,32,0.82);',
    'backdrop-filter:blur(22px) saturate(180%);',
    '-webkit-backdrop-filter:blur(22px) saturate(180%);',
    'border-radius:14px;border:1px solid rgba(255,255,255,0.1);',
    'padding:14px 16px 12px;display:flex;align-items:flex-start;gap:12px;',
    'box-shadow:0 4px 20px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06);',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
    'cursor:default;user-select:none;will-change:transform,opacity;}',

    /* Type borders */
    '.neo-toast.neo-t-success{border-color:rgba(34,211,160,0.22);}',
    '.neo-toast.neo-t-error{border-color:rgba(255,77,106,0.22);}',
    '.neo-toast.neo-t-warning{border-color:rgba(245,158,11,0.22);}',
    '.neo-toast.neo-t-info{border-color:rgba(56,189,248,0.22);}',

    /* Animations */
    '.neo-toast.neo-enter{animation:neo-in .42s cubic-bezier(.34,1.56,.64,1) forwards;}',
    '.neo-toast.neo-exit{animation:neo-out .3s cubic-bezier(.4,0,.8,.2) forwards;}',

    /* Bottom position enter from below */
    '#neo-alert-root.neo-pos-br .neo-toast.neo-enter,',
    '#neo-alert-root.neo-pos-bl .neo-toast.neo-enter{animation-name:neo-in-b;}',

    '@keyframes neo-in{from{opacity:0;transform:translateX(52px) scale(.9)}to{opacity:1;transform:none}}',
    '@keyframes neo-in-b{from{opacity:0;transform:translateY(32px) scale(.9)}to{opacity:1;transform:none}}',
    '@keyframes neo-out{from{opacity:1;transform:none;max-height:120px;margin-bottom:0}',
    'to{opacity:0;transform:translateX(56px) scale(.88);max-height:0;padding:0;margin-bottom:-10px;}}',
    '@keyframes neo-spin{to{transform:rotate(360deg)}}',

    /* Icon wrap */
    '.neo-icon-wrap{flex-shrink:0;width:32px;height:32px;border-radius:9px;',
    'display:flex;align-items:center;justify-content:center;}',
    '.neo-t-success .neo-icon-wrap{background:rgba(34,211,160,0.15);color:#22d3a0;}',
    '.neo-t-error   .neo-icon-wrap{background:rgba(255,77,106,0.15);color:#ff4d6a;}',
    '.neo-t-warning .neo-icon-wrap{background:rgba(245,158,11,0.15);color:#f59e0b;}',
    '.neo-t-info    .neo-icon-wrap{background:rgba(56,189,248,0.15);color:#38bdf8;}',

    /* Body */
    '.neo-body{flex:1;min-width:0;}',
    '.neo-title{font-size:13.5px;font-weight:600;color:#dde3f0;letter-spacing:-.01em;',
    'margin-bottom:2px;line-height:1.3;}',
    '.neo-msg{font-size:12.5px;color:rgba(221,227,240,0.58);line-height:1.45;font-weight:400;}',

    /* Close button */
    '.neo-close{flex-shrink:0;width:22px;height:22px;border-radius:6px;',
    'background:transparent;border:none;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'color:rgba(255,255,255,0.28);transition:all .15s ease;',
    'margin-top:-1px;margin-right:-2px;padding:0;}',
    '.neo-close:hover{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);}',

    /* Progress bar */
    '.neo-progress{position:absolute;bottom:0;left:0;height:2.5px;',
    'border-radius:0 0 0 14px;transform-origin:left;',
    'animation:neo-prog linear forwards;}',
    '.neo-t-success .neo-progress{background:#22d3a0;}',
    '.neo-t-error   .neo-progress{background:#ff4d6a;}',
    '.neo-t-warning .neo-progress{background:#f59e0b;}',
    '.neo-t-info    .neo-progress{background:#38bdf8;}',
    '@keyframes neo-prog{from{width:100%}to{width:0%}}',

    /* Drag state */
    '.neo-dragging{opacity:.85;cursor:grabbing;transition:none!important;}',
  ].join('');

  /* ─────────────────────────────────────────
     INJECT STYLES
  ───────────────────────────────────────── */
  function injectStyles() {
    if (stylesInjected) return;
    if (typeof document === 'undefined') return;
    var style = document.createElement('style');
    style.id = 'neo-alert-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  /* ─────────────────────────────────────────
     GET / CREATE ROOT
  ───────────────────────────────────────── */
  function getRoot() {
    if (!rootEl) {
      rootEl = document.getElementById('neo-alert-root');
      if (!rootEl) {
        rootEl = document.createElement('div');
        rootEl.id = 'neo-alert-root';
        document.body.appendChild(rootEl);
      }
    }
    return rootEl;
  }

  /* ─────────────────────────────────────────
     SET POSITION
  ───────────────────────────────────────── */
  function setPosition(pos) {
    var root = getRoot();
    root.className = POS_MAP[pos] || 'neo-pos-tr';
  }

  /* ─────────────────────────────────────────
     ESCAPE HTML
  ───────────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─────────────────────────────────────────
     GENERATE UNIQUE ID
  ───────────────────────────────────────── */
  function uid() {
    return 'neo-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
  }

  /* ─────────────────────────────────────────
     INIT DRAG TO DISMISS
  ───────────────────────────────────────── */
  function initDrag(el, id) {
    var startX = 0;
    var dx = 0;
    var active = false;

    function onDown(e) {
      if (e.target.closest && e.target.closest('.neo-close')) return;
      active = true;
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      el.classList.add('neo-dragging');
      el.style.transition = 'none';
    }

    function onMove(e) {
      if (!active) return;
      var cx = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      dx = cx - startX;
      el.style.transform = 'translateX(' + dx + 'px)';
      el.style.opacity = Math.max(0, 1 - Math.abs(dx) / 160);
    }

    function onUp() {
      if (!active) return;
      active = false;
      el.classList.remove('neo-dragging');
      el.style.transition = '';
      if (Math.abs(dx) > 80) {
        dismiss(id);
      } else {
        el.style.transform = '';
        el.style.opacity = '';
      }
      dx = 0;
    }

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  }

  /* ─────────────────────────────────────────
     CREATE TOAST (core)
  ───────────────────────────────────────── */
  function create(options) {
    injectStyles();

    var opts = Object.assign({
      type:         'info',
      title:        '',
      message:      '',
      position:     config.position,
      duration:     config.duration,
      pauseOnHover: config.pauseOnHover,
      showProgress: config.showProgress,
      draggable:    config.draggable,
      theme:        null,
      onDismiss:    null,
    }, options);

    var id   = opts.id || uid();
    var root = getRoot();

    // Enforce max toasts — remove oldest first
    if (toasts.size >= config.maxToasts) {
      var oldest = toasts.keys().next().value;
      dismiss(oldest, true);
    }

    setPosition(opts.position);

    var dur = typeof opts.duration === 'number' ? opts.duration : config.duration;

    // Build toast element
    var el = document.createElement('div');
    el.id = id;
    el.className = 'neo-toast neo-t-' + opts.type + ' neo-enter';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');

    // Apply custom theme overrides
    if (opts.theme) {
      var t = opts.theme;
      if (t.background)    el.style.background       = t.background;
      if (t.backdropBlur)  el.style.backdropFilter    = t.backdropBlur;
      if (t.borderColor)   el.style.borderColor       = t.borderColor;
      if (t.borderRadius)  el.style.borderRadius      = t.borderRadius;
      if (t.width)         el.style.width             = t.width;
      if (t.shadow)        el.style.boxShadow         = t.shadow;
    }

    var iWrapStyle = '';
    var titleStyle = '';
    var msgStyle   = '';
    var progStyle  = '';

    if (opts.theme) {
      if (opts.theme.iconBackground || opts.theme.iconColor) {
        iWrapStyle = 'style="' +
          (opts.theme.iconBackground ? 'background:' + opts.theme.iconBackground + ';' : '') +
          (opts.theme.iconColor      ? 'color:'      + opts.theme.iconColor      + ';' : '') +
          '"';
      }
      if (opts.theme.titleColor)    titleStyle = 'style="color:' + opts.theme.titleColor   + ';"';
      if (opts.theme.messageColor)  msgStyle   = 'style="color:' + opts.theme.messageColor + ';"';
      if (opts.theme.progressColor) progStyle  = 'background:' + opts.theme.progressColor + ';';
    }

    el.innerHTML =
      '<div class="neo-icon-wrap" ' + iWrapStyle + '>' +
        (ICONS[opts.type] || ICONS.info) +
      '</div>' +
      '<div class="neo-body">' +
        '<div class="neo-title" ' + titleStyle + '>' + esc(opts.title) + '</div>' +
        (opts.message ? '<div class="neo-msg" ' + msgStyle + '>' + esc(opts.message) + '</div>' : '') +
      '</div>' +
      '<button class="neo-close" aria-label="Dismiss notification">' +
        '<svg width="10" height="10" viewBox="0 0 10 10" fill="none">' +
          '<path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>' +
      '</button>' +
      (opts.showProgress && dur > 0
        ? '<div class="neo-progress" style="animation-duration:' + dur + 'ms;' + progStyle + '"></div>'
        : '');

    root.appendChild(el);

    // Close button handler
    el.querySelector('.neo-close').addEventListener('click', function () {
      dismiss(id);
    });

    // ── Timer logic ──
    var timer    = null;
    var startAt  = Date.now();
    var remaining = dur;

    function startTimer() {
      if (dur <= 0) return;
      timer = setTimeout(function () { dismiss(id); }, remaining);
    }

    function pauseTimer() {
      if (!timer) return;
      clearTimeout(timer);
      remaining -= Date.now() - startAt;
      timer = null;
      var prog = el.querySelector('.neo-progress');
      if (prog) prog.style.animationPlayState = 'paused';
    }

    function resumeTimer() {
      if (dur <= 0) return;
      startAt = Date.now();
      var prog = el.querySelector('.neo-progress');
      if (prog) prog.style.animationPlayState = 'running';
      timer = setTimeout(function () { dismiss(id); }, remaining);
    }

    startTimer();

    if (opts.pauseOnHover) {
      el.addEventListener('mouseenter', pauseTimer);
      el.addEventListener('mouseleave', resumeTimer);
    }

    if (opts.draggable) {
      initDrag(el, id);
    }

    toasts.set(id, { el: el, timer: timer, opts: opts, pauseTimer: pauseTimer, resumeTimer: resumeTimer });

    return id;
  }

  /* ─────────────────────────────────────────
     DISMISS TOAST
  ───────────────────────────────────────── */
  function dismiss(id, immediate) {
    var entry = toasts.get(id);
    if (!entry) return;

    clearTimeout(entry.timer);
    var el = entry.el;

    el.classList.remove('neo-enter');
    el.classList.add('neo-exit');

    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      toasts.delete(id);
      if (entry.opts.onDismiss) entry.opts.onDismiss();
    }, immediate ? 0 : 320);
  }

  /* ─────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────── */

  /**
   * neoAlert(options)  — core call
   * neoAlert("message") — shorthand info
   */
  function neoAlert(options) {
    if (typeof options === 'string') {
      return create({ type: 'info', title: options });
    }
    return create(options);
  }

  /** neoAlert.success(title, options?) */
  neoAlert.success = function (title, opts) {
    return create(Object.assign({ type: 'success', title: title }, opts));
  };

  /** neoAlert.error(title, options?) */
  neoAlert.error = function (title, opts) {
    return create(Object.assign({ type: 'error', title: title }, opts));
  };

  /** neoAlert.warning(title, options?) */
  neoAlert.warning = function (title, opts) {
    return create(Object.assign({ type: 'warning', title: title }, opts));
  };

  /** neoAlert.info(title, options?) */
  neoAlert.info = function (title, opts) {
    return create(Object.assign({ type: 'info', title: title }, opts));
  };

  /**
   * neoAlert.promise(promise, { loading, success, error })
   * Shows a loading spinner, auto-resolves to success or error.
   */
  neoAlert.promise = function (promise, messages) {
    var id = create({
      type:         'info',
      title:        messages.loading || 'Loading…',
      duration:     0,
      showProgress: false,
    });

    var entry = toasts.get(id);
    if (entry) {
      var wrap = entry.el.querySelector('.neo-icon-wrap');
      if (wrap) wrap.innerHTML = ICONS.loading;
    }

    promise.then(function (data) {
      dismiss(id, true);
      var title = typeof messages.success === 'function'
        ? messages.success(data)
        : (messages.success || 'Done!');
      create({ type: 'success', title: title });
    }).catch(function (err) {
      dismiss(id, true);
      var title = typeof messages.error === 'function'
        ? messages.error(err)
        : (messages.error || 'Something went wrong.');
      create({ type: 'error', title: title });
    });

    return id;
  };

  /**
   * neoAlert.dismiss(id) — remove a specific toast
   */
  neoAlert.dismiss = function (id) {
    dismiss(id);
  };

  /**
   * neoAlert.clearAll() — remove every active toast
   */
  neoAlert.clearAll = function () {
    Array.from(toasts.keys()).forEach(function (id) { dismiss(id); });
  };

  /**
   * neoAlert.configure(options) — set global defaults
   * Call this once at app start before showing any toasts.
   */
  neoAlert.configure = function (opts) {
    Object.assign(config, opts);
  };

  /**
   * neoAlert.version
   */
  neoAlert.version = '1.0.0';

  return neoAlert;
});
