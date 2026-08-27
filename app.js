const config = window.SITE_CONFIG;

document.querySelectorAll("[data-config]").forEach((node) => {
  const key = node.dataset.config;
  if (config[key]) node.textContent = config[key];
});

const icons = {
  file: "▤",
  code: "⌘",
  download: "↓",
  play: "▶",
};

document.querySelector("#hero-actions").innerHTML = config.links
  .map((link, index) => `<a class="button ${index === 0 ? "primary" : "secondary"}" href="${link.href}"><span>${icons[link.icon] || "↗"}</span>${link.label}</a>`)
  .join("");

document.querySelector("#hero-metrics").innerHTML = config.metrics
  .map((metric) => `<div><dt>${metric.value}</dt><dd>${metric.label}</dd></div>`)
  .join("");

document.querySelector("#capabilities").innerHTML = config.capabilities
  .map((item) => `<article><span>${item.index}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></article>`)
  .join("");

const sceneVideo = document.querySelector("#scene-video");
const scenePlaceholder = document.querySelector("#scene-video-placeholder");
const sceneSelector = document.querySelector("#scene-selector");
const demoPrev = document.querySelector("#demo-prev");
const demoNext = document.querySelector("#demo-next");
let currentSceneIndex = 0;

sceneSelector.innerHTML = config.demoScenes.map((scene, index) => `<div class="scene-selector-item">
  <button type="button" role="tab" data-scene="${index}" aria-selected="${index === 0}">
    <span>${String(index + 1).padStart(2, "0")}</span><div><small>${scene.category}</small><b>${scene.title}</b><span class="scene-device">${scene.device}</span></div>
  </button>
  ${scene.credit ? `<a class="scene-credit" href="${scene.credit.href}" target="_blank" rel="noopener noreferrer">${scene.credit.label}</a>` : ""}
</div>`).join("");

function selectScene(index) {
  currentSceneIndex = index;
  const scene = config.demoScenes[index];
  sceneSelector.querySelectorAll("button").forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  sceneVideo.pause();
  sceneVideo.classList.remove("ready");
  sceneVideo.poster = scene.poster;
  sceneVideo.src = scene.src;
  scenePlaceholder.hidden = false;
  scenePlaceholder.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><b>Place ${scene.src.split("/").pop()} here</b>`;
  sceneVideo.load();
}

sceneVideo.addEventListener("loadedmetadata", () => {
  scenePlaceholder.hidden = true;
  sceneVideo.classList.add("ready");
  sceneVideo.play().catch(() => {});
});
sceneVideo.addEventListener("error", () => {
  sceneVideo.classList.remove("ready");
  scenePlaceholder.hidden = false;
});
sceneSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-scene]");
  if (button) selectScene(Number(button.dataset.scene));
});
demoPrev.addEventListener("click", () => selectScene((currentSceneIndex - 1 + config.demoScenes.length) % config.demoScenes.length));
demoNext.addEventListener("click", () => selectScene((currentSceneIndex + 1) % config.demoScenes.length));
selectScene(0);

const performanceChart = document.querySelector("#performance-chart");
performanceChart.innerHTML = `<header><div><span>Oxford Spires</span><b>Pose accuracy</b></div><div><span>KITTI-02</span><b>Streaming efficiency</b></div></header>
  <div class="metric-grid">${config.performance.metrics.map((metric) => {
    const max = Math.max(...metric.values);
    return `<section class="metric-panel"><div class="metric-label"><b>${metric.label}</b><span>${metric.direction === "down" ? "LOWER" : "HIGHER"} IS BETTER ${metric.direction === "down" ? "↓" : "↑"}</span></div>
      <div class="bar-group">${metric.values.map((value, index) => `<div class="bar-item" style="--bar-height:${Math.max(8, value / max * 100)}%;--bar-color:${config.performance.colors[index]}"><div class="bar-track"><div class="bar-value">${value.toFixed(2)}${metric.unit ? ` <small>${metric.unit}</small>` : ""}</div><i></i></div><span>${config.performance.methods[index]}</span></div>`).join("")}</div>
    </section>`;
  }).join("")}</div>`;

document.querySelector("#dataset-results").innerHTML = config.datasetResults
  .map((item, datasetIndex) => `<article class="dataset-carousel" data-carousel data-index="0">
    <header class="dataset-carousel-header"><div><p>QUALITATIVE TRAJECTORY</p><h3>${item.title}</h3></div>
      <div class="carousel-index"><b data-carousel-current>01</b><i></i><span>${String(item.sequences.length).padStart(2, "0")}</span></div>
    </header>
    <div class="carousel-viewport">
      <button class="carousel-arrow carousel-arrow-prev" type="button" data-carousel-prev aria-label="Previous ${item.title} sequence" title="Previous sequence"><span>‹</span></button>
      <div class="carousel-track">${item.sequences.map((sequence, sequenceIndex) => `<section class="dataset-slide" aria-hidden="${sequenceIndex !== 0}">
      <header class="dataset-context"><p>${sequence.subtitle}</p>
        <div class="context-rgb">${sequence.rgb.map((image, imageIndex) => `<img src="${image}" alt="${item.title} ${sequence.subtitle} RGB view ${imageIndex + 1}" loading="lazy" />`).join("")}</div>
        ${sequence.auxiliary ? `<figure class="context-aux"><img src="${sequence.auxiliary.image}" alt="${sequence.auxiliary.name}" loading="lazy" /><figcaption>${sequence.auxiliary.name}</figcaption></figure>` : ""}
        <div class="inference-meta"><span></span><p>${sequence.frameLabel}</p></div>
      </header>
      <div class="method-comparison">${sequence.methods.map((method) => `<figure>
        <div class="result-media"><img src="${method.image}" alt="${item.title} ${sequence.subtitle} trajectory from ${method.name}" loading="lazy" /><div class="image-placeholder">Add ${method.image.split("/").pop()}</div></div>
        <figcaption>${method.name}</figcaption>
      </figure>`).join("")}</div>
    </section>`).join("")}</div>
      <button class="carousel-arrow carousel-arrow-next" type="button" data-carousel-next aria-label="Next ${item.title} sequence" title="Next sequence"><span>›</span></button>
    </div>
    <div class="carousel-dots" aria-label="${item.title} sequences">${item.sequences.map((_, index) => `<button type="button" data-carousel-dot="${index}" class="${index === 0 ? "active" : ""}" aria-label="Show sequence ${index + 1}"></button>`).join("")}</div>
  </article>`)
  .join("");

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".dataset-slide")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const current = carousel.querySelector("[data-carousel-current]");
  let pointerStart = null;
  const select = (requested) => {
    const index = (requested + slides.length) % slides.length;
    carousel.dataset.index = String(index);
    track.style.transform = `translateX(-${index * 100}%)`;
    current.textContent = String(index + 1).padStart(2, "0");
    slides.forEach((slide, slideIndex) => slide.setAttribute("aria-hidden", String(slideIndex !== index)));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
  };
  carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => select(Number(carousel.dataset.index) - 1));
  carousel.querySelector("[data-carousel-next]").addEventListener("click", () => select(Number(carousel.dataset.index) + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => select(Number(dot.dataset.carouselDot))));
  track.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
  track.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 45) select(Number(carousel.dataset.index) + (distance < 0 ? 1 : -1));
    pointerStart = null;
  });
  track.addEventListener("pointercancel", () => { pointerStart = null; });
});
document.querySelectorAll(".result-media img").forEach((image) => {
  image.addEventListener("load", () => image.nextElementSibling.remove(), { once: true });
  image.addEventListener("error", () => image.remove(), { once: true });
});

document.querySelector("#bibtex").textContent = config.bibtex;
document.querySelector("#copy-bibtex").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(config.bibtex);
  event.currentTarget.textContent = "Copied";
  setTimeout(() => { event.currentTarget.textContent = "Copy BibTeX"; }, 1600);
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#site-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});
nav.addEventListener("click", () => { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); });

const lightbox = document.querySelector("#lightbox");
document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    lightbox.querySelector("img").src = button.dataset.lightbox;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
}, { threshold: 0.12 });
document.querySelectorAll(".section-heading, .demo-item, .performance-chart").forEach((node) => observer.observe(node));
