// Tiny helper: el('button', {class:'btn', onclick: fn}, 'Text', childNode)
export function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  return add(n, kids);
}

// Appends children to a parent. Accepts nodes, text, nested arrays; skips false/null/undefined.
// Use this instead of parent.append(...), which would print "false" and "[object ...]".
export function add(parent, ...kids) {
  for (const c of kids.flat(Infinity)) {
    if (c != null && c !== false) parent.append(c.nodeType ? c : document.createTextNode(c));
  }
  return parent;
}

// Loads an app's stylesheet once. Pass new URL('./x.css', import.meta.url).
const loadedCss = new Set();
export function loadCss(url) {
  const href = String(url);
  if (loadedCss.has(href)) return;
  loadedCss.add(href);
  document.head.append(el('link', { rel: 'stylesheet', href }));
}
