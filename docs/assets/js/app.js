const timelineContainer = document.querySelector("#timeline-items");
let timelineData = [];

const statusLabels = {
  ready: "ready",
  in_progress: "in progress",
  upcoming: "upcoming",
};

const createTimelineCard = (item, index) => {
  const wrapper = document.createElement("article");
  const alignment = item.featured ? "featured" : index % 2 === 0 ? "left" : "right";
  wrapper.className = `timeline-card ${alignment}`;

  const card = document.createElement("div");
  card.className = "card-content";

  if (item.featured) {
    card.classList.add("featured");
  }

  if (item.status === "upcoming") {
    card.classList.add("muted");
  }

  const header = document.createElement("div");
  header.className = "card-header";

  const status = document.createElement("span");
  status.className = `status ${item.status}`;
  status.textContent = statusLabels[item.status] ?? item.status;

  const year = document.createElement("h2");
  year.className = "card-year";
  year.textContent = item.year;

  header.append(year, status);

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = item.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const button = document.createElement("a");
  button.className = "open-button";
  button.href = item.link;
  button.textContent = "Open";

  meta.append(button);
  card.append(header, title, meta);
  wrapper.appendChild(card);

  return wrapper;
};

const renderTimeline = (items) => {
  timelineContainer.innerHTML = "";

  items.forEach((item, index) => {
    timelineContainer.appendChild(createTimelineCard(item, index));
  });
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
