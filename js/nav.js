import { GENRE_OPTIONS } from "./api.js";

const dropdown = document.querySelector("[data-genre-dropdown]");
const toggleBtn = document.querySelector("[data-genre-toggle]");
const list = document.querySelector("[data-genre-list]");

function closeDropdown() {
  dropdown?.classList.remove("open");
  toggleBtn?.setAttribute("aria-expanded", "false");
}

function openDropdown() {
  if (!dropdown) return;
  dropdown.classList.add("open");
  toggleBtn?.setAttribute("aria-expanded", "true");
}

function toggleDropdown() {
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains("open");
  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function buildList() {
  if (!list) return;
  list.innerHTML = "";

  GENRE_OPTIONS.forEach(opt => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "menu-dropdown-item";
    item.textContent = opt.label;
    item.addEventListener("click", () => {
      window.location.href = `/html/genre.html?genre=${encodeURIComponent(opt.key)}`;
    });
    list.appendChild(item);
  });
}

function handleClickOutside(e) {
  if (!dropdown) return;
  if (dropdown.contains(e.target)) return;
  closeDropdown();
}

function handleKeydown(e) {
  if (e.key === "Escape") closeDropdown();
}

function initNavDropdown() {
  if (!dropdown || !toggleBtn || !list) return;
  buildList();
  toggleBtn.addEventListener("click", toggleDropdown);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
}

initNavDropdown();
