const state = { search: "", domain: "all", mode: "all" };

const resultsEl = document.getElementById("results");
const emptyStateEl = document.getElementById("empty-state");
const errorStateEl = document.getElementById("error-state");
const loadingStateEl = document.getElementById("loading-state");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const dialog = document.getElementById("detail-dialog");
const dialogBody = document.getElementById("dialog-body");

function showState(name) {
  loadingStateEl.hidden = name !== "loading";
  errorStateEl.hidden = name !== "error";
  emptyStateEl.hidden = name !== "empty";
}

function getFiltered() {
  const q = state.search.trim().toLowerCase();
  return internships.filter((item) => {
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.skills.some((s) => s.toLowerCase().includes(q));
    const matchesDomain = state.domain === "all" || item.domain === state.domain;
    const matchesMode = state.mode === "all" || item.mode === state.mode;
    return matchesSearch && matchesDomain && matchesMode;
  });
}

function render() {
  const filtered = getFiltered();
  resultsEl.innerHTML = "";

  if (filtered.length === 0) {
    showState("empty");
    return;
  }
  showState("none");

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "internship-card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.domain} &middot; ${item.mode} &middot; ${item.location}</p>
      <p>${item.skills.join(", ")}</p>
      <button type="button" class="view-details-btn" data-id="${item.id}">
        View details
      </button>
    `;
    resultsEl.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  clearSearchBtn.hidden = e.target.value.length === 0;
  render();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.search = "";
  clearSearchBtn.hidden = true;
  searchInput.focus();
  render();
});

document.querySelectorAll("[data-domain]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-domain]").forEach((b) =>
      b.setAttribute("aria-pressed", "false")
    );
    btn.setAttribute("aria-pressed", "true");
    state.domain = btn.dataset.domain;
    render();
  });
});

document.querySelectorAll("[data-mode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach((b) =>
      b.setAttribute("aria-pressed", "false")
    );
    btn.setAttribute("aria-pressed", "true");
    state.mode = btn.dataset.mode;
    render();
  });
});

document.getElementById("clear-all-btn").addEventListener("click", () => {
  searchInput.value = "";
  state.search = "";
  state.domain = "all";
  state.mode = "all";
  document.querySelectorAll("[data-domain]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.domain === "all" ? "true" : "false")
  );
  document.querySelectorAll("[data-mode]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.mode === "all" ? "true" : "false")
  );
  render();
});

document.getElementById("retry-btn").addEventListener("click", render);

resultsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".view-details-btn");
  if (!btn) return;
  const item = internships.find((i) => i.id === btn.dataset.id);
  openDialog(item);
});

function openDialog(item) {
  dialogBody.innerHTML = `
    <h2 id="dialog-title">${item.title}</h2>
    <p>${item.domain} &middot; ${item.mode} &middot; ${item.location}</p>
    <p>Skills: ${item.skills.join(", ")}</p>
    <p>Openings: ${item.openings}</p>
  `;
  dialog.showModal();
}

render();