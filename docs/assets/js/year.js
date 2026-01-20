const storyContainer = document.querySelector("[data-story]");

const getStoryId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("y");
};

const renderStory = (item) => {
  const title = document.createElement("h2");
  title.textContent = item.year;

  const subtitle = document.createElement("h3");
  subtitle.textContent = item.title;

  const content = document.createElement("div");
  content.className = "story-content";

  item.body.split("\\n").forEach((line, index, lines) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    const paragraph = document.createElement("p");
    paragraph.textContent = trimmed;
    if (trimmed.startsWith("Спасибо, Люба")) {
      paragraph.classList.add("story-signoff");
    }
    content.appendChild(paragraph);
  });

  storyContainer.replaceChildren(title, subtitle, content);
};

fetch("data/years.json")
  .then((response) => response.json())
  .then((data) => {
    const storyId = getStoryId();
    const item = data.find((entry) => entry.id === storyId);

    if (!item) {
      storyContainer.textContent = "Story not found.";
      return;
    }

    renderStory(item);
  })
  .catch(() => {
    storyContainer.textContent = "Unable to load story content.";
  });
