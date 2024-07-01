//
//  main.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

import { $, $$ } from "./lib.js";
import { Tile } from "./components/Tile.js";
import { refreshAppearance } from "./appearance.js";

// Load data
fetchJSON("assets/data.json").then(data => {
    // Greeting
    $("#greeting h1").innerText = data.greeting.heading;
    $("#greeting p").innerText = data.greeting.description;

    // Introduction
    $("#intro .tile h2").innerHTML = data.intro.heading;
    data.intro.description.split("\n").forEach(line =>
        $("#intro .tile-overlay div>p").insertAdjacentHTML("beforeend", `<p>${line}</p>`)
    );
    data.intro.timeline.forEach(milestone => {
        $("#timeline>.row").insertAdjacentHTML("beforeend", `
            <div class="col-md-4 col-lg-4 p-4">
              <div class="d-flex flex-column align-items-center text-center gap-3 px-3">
                <img src="${milestone.img}" alt="${milestone.img.split(".") + "-logo"}" class="app-icon">
                <p>
                  <span class="fw-kinda-bold">${milestone.title}</span><br>
                  <span>${milestone.subtitle}</span><br>
                  <span class="text-matte-light">${milestone.date}</span><br>
                </p>
              </div>
            </div>
        `);
    })

    // Skills
    const rows = $$(".technologies-row");
    const languages = ["html", "css", "js", "php", "java", "python", "swift", "c"];
    const technologies = ["node", "react", "docker", "gcp", "pg", "mysql", "mongodb", "ios-sdk"];
    const tools = ["github", "postman", "vscode", "eclipse", "android-studio", "intellij", "xcode", "terminal"];
    for (let i = 0; i < 2; i++) {
        for (const language of languages)
            rows[0].insertAdjacentHTML("beforeend", `<img src="assets/img/technology-icons/${language}.png" alt="${language}">`);
        for (const technology of technologies)
            rows[1].insertAdjacentHTML("beforeend", `<img src="assets/img/technology-icons/${technology}.png" alt="${technology}">`);
        for (const tool of tools)
            rows[2].insertAdjacentHTML("beforeend", `<img src="assets/img/technology-icons/${tool}.png" alt="${tool}">`);
    }
    rows[1].insertAdjacentHTML("beforeend", `<img src="assets/img/technology-icons/${technologies[0]}.png" alt="${technologies[0]}">`);
    $("#skills .tile-content p:first-of-type").innerText = data.skills.description;
    data.skills.list.forEach(item =>
        $("#skills>.section-inner-container>.row").insertAdjacentHTML("beforeend",
            Tile(item, data.skills.color, data.skills.muted_color)
        )
    );

    let projectTiles = [];
    let projectPromises = [];

    // Fetch projects and make tiles
    data.projects.list.forEach(project => {
        let customCoverDescriptionHTML = `
        <!-- URL -->
        <a target="_blank"
            href="${project.custom_url ?? "https://github.com/" + data.github_username + "/" + project.heading}"
            class="fs-6 link-primary d-block" role="button"
            style="margin-top: 4px; margin-bottom: 10px; width: fit-content;"
        >
            <span class="link-text fw-normal">
                ${project.custom_url_text ?? "View on GitHub"}
            </span>
            <i class="bi bi-chevron-right"></i>
        </a>
        ${project.custom_url_2 ? `
        <a target="_blank"
            href="${project.custom_url_2.url}"
            class="fs-6 link-primary d-block" role="button"
            style="margin-top: -5px; margin-bottom: 10px; width: fit-content;"
        >
            <span class="link-text fw-normal">
                ${project.custom_url_2.text}
            </span>
            <i class="bi bi-chevron-right"></i>
        </a>
        ` : ""}
        <!-- Topics -->
        <p>`;
        // Grab project topics from data.json
        project.topics?.forEach(topic => customCoverDescriptionHTML += `
            <span class="topic-badge m-1" style="color:${data.projects.color}; border-color: ${data.projects.color};">
                ${topic}
            </span>`); customCoverDescriptionHTML += `
        </p>`;
        projectTiles.push(Tile(project, data.projects.color, data.projects.muted_color, customCoverDescriptionHTML));

        return; // Not using GitHub API because of the rate limit (60 requests/hour)

        // Fetch project topics from GitHub API
        const promise = fetchJSON(`https://api.github.com/repos/${data.github_username}/${project.heading}`)
            .then(json => {
                project.cover_description = json.description;
                json.topics.forEach(topic => customCoverDescriptionHTML += `
                    <span class="topic-badge m-1" style="color:${data.projects.color}; border-color: ${data.projects.color};">
                        ${topic}
                    </span>`);
                customCoverDescriptionHTML += `</p>`;
                return Tile(project, data.projects.color, data.projects.muted_color, customCoverDescriptionHTML);
            })
            .catch(error => console.error(error))
        projectPromises.push(promise);
    });

    projectTiles.forEach(tile => $("#projects .row").insertAdjacentHTML("beforeend", tile));

    // Successfully fetched data from GitHub API
    // Promise.all(projectPromises).then(tiles => {
    //     tiles.forEach(tile => $("#source-code").insertAdjacentHTML("beforebegin", tile));
    //     refreshAppearanceForProgrammaticallyAddedElements();
    // }).catch(error => console.error(error));

    // Socials
    data.socials.forEach(item => {
        const username = item.username_prefix ? `${item.username_prefix}${item.username}` : item.username;
        $("#contact #socials-container").insertAdjacentHTML("beforeend", `
            <a href="https://www.${item.platform}.com/${username}" target="_blank"
                class="social-link text-light d-flex flex-row align-items-center m-1"
            >
                <img src="assets/img/app-icons/app-icon-${item.platform}.png" alt="${item.platform}-icon" class="app-icon m-2">
                ${item.username_prefix ? username : "@" + item.username}
            </a>
        `);
    });

    refreshAppearance();
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

window.requestResume = function () {
    $("#contact").scrollIntoView(scrollIntoViewOptions);
    const checkbox = $("#contact .plus-go-x>input");
    const message = $("#contact #message");
    message.value = "Hello, I'd like to take a look at your resume.";
    if (checkbox.checked) return;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
}
