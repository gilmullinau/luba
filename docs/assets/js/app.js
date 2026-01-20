const timelineContainer = document.querySelector("#timeline-items");
const searchInput = document.querySelector("#timeline-search");
let timelineData = [];

const statusLabels = {
  ready: "ready",
  in_progress: "in progress",
  upcoming: "upcoming",
};

const createTimelineCard = (item, index) => {
  const wrapper = document.createElement("article");
  wrapper.className = `timeline-card ${index % 2 === 0 ? "left" : "right"}`;

  const card = document.createElement("div");
  card.className = "card-content";

  if (item.isFeatured) {
    card.classList.add("featured");
  }

  if (item.status === "upcoming") {
    card.classList.add("muted");
  }

  const year = document.createElement("h2");
  year.className = "card-year";
  year.textContent = item.year;

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = item.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const status = document.createElement("span");
  status.className = `status ${item.status}`;
  status.textContent = statusLabels[item.status] ?? item.status;

  const button = document.createElement("a");
  button.className = "open-button";
  button.href = item.link;
  button.textContent = "Open";

  meta.append(status, button);
  card.append(year, title, meta);
  wrapper.appendChild(card);

  return wrapper;
};

const renderTimeline = (items) => {
  timelineContainer.innerHTML = "";

  items.forEach((item, index) => {
    timelineContainer.appendChild(createTimelineCard(item, index));
  });
};

const filterTimeline = (query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    renderTimeline(timelineData);
    return;
  }

  const filtered = timelineData.filter((item) => {
    const haystack = `${item.year} ${item.title}`.toLowerCase();
    return haystack.includes(normalized);
  });

  renderTimeline(filtered);
};

fetch("data/years.json")
  .then((response) => response.json())
  .then((data) => {
    timelineData = data;
    renderTimeline(timelineData);
  })
  .catch(() => {
    timelineContainer.innerHTML =
      "<p class=\"card-title\">Unable to load timeline data.</p>";
  });

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    filterTimeline(event.target.value);
  });
}
