export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function createElement(tag, props = {}) {
  const el = document.createElement(tag);
  Object.assign(el, props);
  return el;
}

export function stripHtml(html = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function setStatus(container, message) {
  if (!container) return;
  container.innerHTML = `<div class="placeholder-box">${message}</div>`;
}
