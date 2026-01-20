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

  const gallery = document.createElement("div");
  gallery.className = "story-gallery";

  if (Array.isArray(item.images) && item.images.length > 0) {
    item.images.forEach((image, idx) => {
      const figure = document.createElement("figure");
      figure.className = "story-photo";
      if (idx === 0) {
        figure.classList.add("story-photo--featured");
      }

      const link = document.createElement("a");
      link.href = image.full || image.src;
      link.target = "_blank";
      link.rel = "noopener";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || "";
      img.loading = "lazy";

      link.appendChild(img);
      figure.appendChild(link);
      gallery.appendChild(figure);
    });
  }

  if (gallery.childElementCount > 0) {
    storyContainer.replaceChildren(title, subtitle, content, gallery);
  } else {
    storyContainer.replaceChildren(title, subtitle, content);
  }
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
