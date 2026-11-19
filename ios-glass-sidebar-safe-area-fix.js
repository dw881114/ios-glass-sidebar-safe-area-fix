/**
 * iOS safe-area fix for the Home Assistant Glass Sidebar phone drawer.
 *
 * Install this file as a Home Assistant frontend JavaScript module. It does
 * not modify Glass Sidebar and is intentionally a no-op outside iOS/iPadOS.
 */
(() => {
  const globalKey = "__iosGlassSidebarSafeAreaFix";
  if (window[globalKey]) return;
  window[globalKey] = true;

  const userAgent = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!isIOS) return;

  const phoneQuery = "(max-width: 600px)";
  const watchedRoots = new WeakSet();
  const sheets = new WeakMap();
  const fallbackStyles = new WeakMap();
  let frame = 0;

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (_error) {
      return null;
    }
  }

  // Glass Sidebar caches the shared and personal settings in localStorage.
  // Match its phone drawer inset while keeping the safe-area padding additive.
  function phoneInset() {
    const shared = readJson("glass-sidebar-config") || {};
    if (!shared.enabled) return null;

    const personal = readJson("glass-sidebar-personal");
    const values = {
      ...shared,
      ...(personal?.use_own ? personal.values || {} : {}),
    };

    if (values.floating === false || values.mobile_rounded === false) return 0;
    const inset = Number(values.inset ?? 8);
    return Number.isFinite(inset) ? Math.max(0, Math.min(24, inset)) : 8;
  }

  function cssText() {
    const inset = phoneInset();
    if (inset === null) return "";

    return `
      @media ${phoneQuery} {
        /*
         * The extra :host specificity wins over Glass Sidebar's padding
         * shorthand even if its adopted stylesheet is applied afterward.
         */
        :host wa-drawer::part(dialog) {
          padding-block-start: calc(
            max(
              var(--safe-area-inset-top, 0px),
              env(safe-area-inset-top, 0px)
            ) + ${inset}px
          ) !important;
        }
      }
    `;
  }

  function applyFix(drawer) {
    const root = drawer?.shadowRoot;
    if (!root) return;

    const css = cssText();
    let sheet = sheets.get(root);
    if (sheet) {
      sheet.replaceSync(css);
      return;
    }

    if (
      "adoptedStyleSheets" in root &&
      typeof CSSStyleSheet !== "undefined" &&
      "replaceSync" in CSSStyleSheet.prototype
    ) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      sheets.set(root, sheet);
      return;
    }

    let style = fallbackStyles.get(root);
    if (!style) {
      style = document.createElement("style");
      style.dataset.iosGlassSidebarSafeArea = "";
      root.append(style);
      fallbackStyles.set(root, style);
    }
    style.textContent = css;
  }

  function watch(root) {
    if (!root || watchedRoots.has(root)) return;
    watchedRoots.add(root);
    new MutationObserver(schedule).observe(root, {
      childList: true,
      subtree: true,
    });
  }

  function inspect() {
    frame = 0;
    const ha = document.querySelector("home-assistant");
    const haRoot = ha?.shadowRoot;
    watch(document.documentElement);
    watch(haRoot);

    const main = haRoot?.querySelector("home-assistant-main");
    const mainRoot = main?.shadowRoot;
    watch(mainRoot);

    const drawer = mainRoot?.querySelector("ha-drawer");
    if (drawer) applyFix(drawer);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(inspect);
  }

  window.addEventListener("storage", schedule);
  customElements.whenDefined("home-assistant").then(schedule);
  schedule();
})();
