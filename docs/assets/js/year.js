const storyContainer = document.querySelector("[data-story]");

const getStoryId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("y");
};

const renderStory = (item, nextItem) => {
  const title = document.createElement("h2");
  title.textContent = item.year;

  const subtitle = document.createElement("h3");
  subtitle.textContent = item.title;

  const content = document.createElement("div");
  content.className = "story-content";

  const stickers = ["✨", "🌿", "💚", "🎉", "📌", "🌟", "📖", "🫶"];

  const setImageSource = (img, image) => {
    const fallbacks = Array.isArray(image.fallbacks) ? [...image.fallbacks] : [];
    img.src = image.src;
    if (fallbacks.length === 0) {
      return;
    }
    img.addEventListener("error", () => {
      const nextSource = fallbacks.shift();
      if (nextSource) {
        img.src = nextSource;
      }
    });
  };

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
    setImageSource(img, item.inlineImage);
    img.alt = item.inlineImage.alt || "";
    img.loading = "lazy";

    link.appendChild(img);
    figure.appendChild(link);
    content.appendChild(figure);
    inlineInserted = true;
  };

  item.body.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed.toLowerCase().startsWith("дополнительный раздел")) {
      insertInlineImage();
      return;
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

  const buildGallery = (images, className = "") => {
    const gallery = document.createElement("div");
    gallery.className = className
      ? `story-gallery ${className}`
      : "story-gallery";

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
      setImageSource(img, image);
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

  if (Array.isArray(item.imagesLarge) && item.imagesLarge.length > 0) {
    elements.push(buildGallery(item.imagesLarge, "story-gallery--large"));
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    elements.push(buildGallery(item.images));
  }

  if (Array.isArray(item.imagesBottom) && item.imagesBottom.length > 0) {
    elements.push(buildGallery(item.imagesBottom));
  }

  if (nextItem && nextItem.link) {
    const nextWrap = document.createElement("div");
    nextWrap.className = "story-next";

    const nextLink = document.createElement("a");
    nextLink.href = nextItem.link;
    nextLink.className = "story-next__button";
    nextLink.textContent = `Следующий период: ${nextItem.year}`;

    const nextTitle = document.createElement("span");
    nextTitle.className = "story-next__title";
    nextTitle.textContent = nextItem.title || "";

    nextLink.appendChild(nextTitle);
    nextWrap.appendChild(nextLink);
    elements.push(nextWrap);
  }

  storyContainer.replaceChildren(...elements);
};

fetch("data/years.json")
  .then((response) => response.json())
  .then((data) => {
    const storyId = getStoryId();
    const itemIndex = data.findIndex((entry) => entry.id === storyId);
    const item = itemIndex >= 0 ? data[itemIndex] : null;

    if (!item) {
      storyContainer.textContent = "Story not found.";
      return;
    }

    const nextItem = data[itemIndex + 1];
    renderStory(item, nextItem);
  })
  .catch(() => {
    storyContainer.textContent = "Unable to load story content.";
  });
