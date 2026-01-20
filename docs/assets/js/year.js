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

  const stickers = ["✨", "🌿", "💚", "🎉", "📌", "🌟", "📖", "🫶"];

  let inlineInserted = false;
  const insertInlineImage = () => {
    if (!item.inlineImage || inlineInserted) {
      return;
    }
    const figure = document.createElement("figure");
    figure.className = "story-inline-image";

    const link = document.createElement("a");
    link.href = item.inlineImage.full || item.inlineImage.src;
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement("img");
    img.src = item.inlineImage.src;
    img.alt = item.inlineImage.alt || "";
    img.loading = "lazy";

    link.appendChild(img);
    figure.appendChild(link);
    content.appendChild(figure);
    inlineInserted = true;
  };

  item.body.split("\\n").forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed.toLowerCase().startsWith("дополнительный раздел")) {
      insertInlineImage();
    }
    const paragraph = document.createElement("p");
    const sticker = document.createElement("span");
    sticker.className = "story-sticker";
    sticker.textContent = stickers[index % stickers.length];

    const text = document.createElement("span");
    text.textContent = trimmed;

    paragraph.append(sticker, text);
    if (trimmed.startsWith("Спасибо, Люба")) {
      paragraph.classList.add("story-signoff");
    }
    content.appendChild(paragraph);
  });

  if (item.inlineImage && !inlineInserted) {
    insertInlineImage();
  }

  const buildGallery = (images) => {
    const gallery = document.createElement("div");
    gallery.className = "story-gallery";

    images.forEach((image, idx) => {
      const figure = document.createElement("figure");
      figure.className = "story-photo";
      if (idx === 0 && images.length > 2) {
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

    return gallery;
  };

  const elements = [title, subtitle];

  if (Array.isArray(item.imagesTop) && item.imagesTop.length > 0) {
    elements.push(buildGallery(item.imagesTop));
  }

  elements.push(content);

  if (Array.isArray(item.images) && item.images.length > 0) {
    elements.push(buildGallery(item.images));
  }

  if (Array.isArray(item.imagesBottom) && item.imagesBottom.length > 0) {
    elements.push(buildGallery(item.imagesBottom));
  }

  storyContainer.replaceChildren(...elements);
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
