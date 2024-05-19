//
//  Tile.js
//  portfolio
//
//  Created by Foxster on 2024-01-05.
//  Copyright (c) 2024 Foxster. All rights reserved.
//

export const Tile = (item, primaryColor, secondaryColor, customCoverDescriptionHTML) => {
  let html = `
    <div class="col
      col-md-${item.md_size ?? "12"}
      col-lg-${item.lg_size ?? item.md_size ?? "12"}
    ">
      <div class="tile bg-light-secondary p-4-5 p-md-5 rounded-5 h-100 d-flex flex-column justify-content-between"`;
  if (!item.img && primaryColor) html += ` 
        style="background: linear-gradient(145deg, ${primaryColor} 45%, ${secondaryColor ?? primaryColor} 80%);"`; html += `
      >
        <h5 ${item.img ? "style='color: " + primaryColor + ";'" : "class='text-white'"}>
          ${item.heading}
        </h5>`; html += `
        <div class="tile-content h-100 d-flex flex-column
          ${item.img ? "justify-content-between" : "justify-content-center"}
          fw-kinda-bold
        ">`;
  if (item.img) html += `
          <div>
            <p class="lh-md">${item.cover_description}</p>
            ${customCoverDescriptionHTML ?? ""}
          </div>
          <div>
            <img src="${item.img}" alt="${item.img_alt}" class="${item.img_type}">
          </div>
          ${item.center_image ? "<div></div>" : ""}`;
  else html += `
          <div class="mb-2 mb-md-3
            ${item.lg_size >= 6 ? "p-md-3 p-lg-5" : ""}
            text-white
          ">
            <i class="bi ${item.bootstrap_icon}" style="font-size: 5em;"></i>
            <h2>${item.cover_description}</h2>
          </div>`; html += `
        </div>
        <div class="tile-overlay p-4-5 p-md-5 fs-6 rounded-5 lh-md fw-kinda-bold initially-hidden d-none">
          <div class="d-flex flex-column align-items-center justify-content-center h-100 text-white"><div>`;
  if (item.description) item.description.split("\n").forEach(line => html += `
            <p>${line}</p>`); html += `
          </div></div>
        </div>`; html += `
        <span class="tile-overlay-background rounded-5 initially-hidden"
          style="background-color: ${primaryColor};">
        </span>`;
  if (item.description) html += `
        <div class="plus-go-x-container">
          <label class="plus-go-x ${item.img ? "" : "fill-white"}">
            <input type="checkbox" onChange="plusGoXHandler(event);">
            <div class="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>
            </div>
          </label>
        </div>`; html += `
      </div>
    </div>`;
  return html;
};
