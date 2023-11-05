//
//  script.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

const greetingHeading = document.querySelector("#greeting h1");
const greetingDescription = document.querySelector("#greeting p");
const introHeading = document.querySelector("#intro .tile h2");
const introDescription = document.querySelector("#intro .tile-overlay div>p");
const skillsDescription = document.querySelector("#skills>div>.row>.col p:first-of-type");
const skillsTileContainer = document.querySelector("#skills>div>.row");
const projectTileContainer = document.querySelector("#projects>div .row");

function requestResume() {
    const checkbox = document.querySelector("#contact .plus-go-x>input");
    const message = document.querySelector("#contact #message");
    message.value = "Hello!\nI'd like to take a look at your resume.";

    if (checkbox.checked) return;

    setTimeout(_ => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change"));
    }, 1300);
}

fetchJSON("assets/data.json").then(data => {
    // Greeting
    greetingHeading.innerText = data.greeting.heading;
    greetingDescription.innerText = data.greeting.description;

    // Introduction
    introHeading.innerText = data.intro.heading;
    // introDescription.innerText = data.intro.description;
    data.intro.description.split("\n").forEach(line =>
        introDescription.insertAdjacentHTML("beforeend", `<p>${line}</p>`)
    );

    // Skills
    skillsDescription.innerText = data.skills.description;
    data.skills.list.forEach(item =>
        skillsTileContainer.insertAdjacentHTML("beforeend", Tile(item, data.skills.color, data.skills.muted_color))
    );

    let projectPromises = [],
        projectTiles = [];

    // Fetch projects and make tiles
    data.projects.list.forEach(project => {
        let html = `
        <!-- URL -->
        <a href="${project.custom_url ?? "https://github.com/" + data.github_username + "/" + project.heading}"
            class="fs-6 link-primary d-block" role="button" style="margin-top: 4px; margin-bottom: 10px; width: fit-content;"
        >
            <span class="link-text fw-normal">${project.custom_url_text ?? "View on GitHub"}</span>
            <i class="bi bi-chevron-right"></i>
        </a>
        <!-- Topics -->
        <p>`; /* Project topics from data.json */ project.topics.forEach(topic => html += `
            <span class="topic-badge m-1" style="color:${data.projects.color}; border-color: ${data.projects.color};">${topic}</span>`); html += `
        </p>`;
        projectTiles.push(Tile(project, data.projects.color, data.projects.muted_color, html));

        return;

        // Fetch project topics from GitHub API
        const promise = fetchJSON(`https://api.github.com/repos/${data.github_username}/${project.heading}`)
            .then(json => {
                project.cover_description = json.description;
                json.topics.forEach(topic => html += `
            <span class="topic-badge m-1" style="color:${data.projects.color}; border-color: ${data.projects.color};">${topic}</span>`);
                html += `</p>`;
                return Tile(project, data.projects.color, data.projects.muted_color, html);
            })
            .catch(error => console.error(error))
        projectPromises.push(promise);
    });

    // Successfully fetched data from GitHub API
    Promise.all(projectPromises).then((tiles) => {
        tiles.forEach(tile => projectTileContainer.insertAdjacentHTML("beforeend", tile));
        projectTiles.forEach(tile => projectTileContainer.insertAdjacentHTML("beforeend", tile));
        refreshAppearanceForProgrammaticallyAddedElements();
    }).catch(error => console.error(error));

    const socialsContainer = document.querySelector("#contact #socials-container");
    data.socials.forEach(item => {
        const username = item.username_prefix ? `${item.username_prefix}${item.username}` : item.username;
        socialsContainer.insertAdjacentHTML("beforeend", `
        <a href="https://www.${item.platform}.com/${username}" 
            target="_blank" class="social-link text-light d-flex flex-row align-items-center m-1"
        >
            <img src="assets/img/app-icon-${item.platform}.png" alt="${item.platform}-icon" class="app-icon m-2">
            ${item.username_prefix ? username : "@" + item.username}
        </a>`);
    });

    refreshAppearanceForProgrammaticallyAddedElements();
}).catch(error => console.error(error));

async function fetchJSON(url) {
    const json = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .catch(error => console.error(error));
    return json;
}

function Tile(item, primaryColor, primaryColorMuted, customCoverDescriptionHTML) { let html = `
<div class="col col-md-${item.md_size ?? "12"} col-lg-${item.lg_size ?? item.md_size ?? "12"}">
    <div class="tile bg-white p-4-5 p-md-5 rounded-5 h-100 d-flex flex-column justify-content-between"`; if (!item.img && primaryColor) html += `
        style="background: linear-gradient(145deg, ${primaryColor} 20%, ${primaryColorMuted ?? primaryColor} 60%);"`; html += `
    >`; html += `
        <h5 ${item.img ? "style='color: " + primaryColor + ";'" : "class='text-white'"}>
            ${item.heading}
        </h5>`; html += `
        <div class="tile-content h-100 d-flex flex-column
            ${item.img ? "justify-content-between" : "justify-content-center"} fw-kinda-bold"
        >`; if (item.img) html += `
            <div>
                <p class="lh-md">${item.cover_description}</p>
                ${customCoverDescriptionHTML ?? ""}
            </div>
            <div>
                <img src="${item.img}" alt="${item.img_alt}" class="${item.img_type}">
            </div>
            ${item.center_image ? "<div></div>" : ""}`; else html += `
            <div class="mb-2 mb-md-3 ${item.lg_size >= 6 ? "p-md-3 p-lg-5" : ""} text-white">
                <i class="bi ${item.bootstrap_icon}" style="font-size: 5em;"></i>
                <h2>${item.cover_description}</h2>
            </div>`; html += `
        </div>`; html += `
        <div class="tile-overlay p-4-5 p-md-5 fs-6 rounded-5 lh-md fw-kinda-bold initially-hidden d-none">
            <div class="d-flex flex-column align-items-center justify-content-center h-100 text-white">`; if (item.description) item.description.split("\n").forEach(line => html += `
                <p>${line}</p>`); html += `
            </div>
        </div>`; html += `
            <span class="tile-overlay-background rounded-5 initially-hidden" style="background-color: ${primaryColor};"></span>`; if (item.description) html += `
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
</div>`; return html;
};