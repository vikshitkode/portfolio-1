//
//  appearance.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

const navigationBar = document.getElementById("navbar");
const navigationBarTogglerBreadCrusts = document.querySelectorAll("#navbar .navbar-toggler-bread-crust");
const blurBackgroundElements = document.querySelectorAll(".bg-blur");
const lightOutlineButtons = document.querySelectorAll(".btn-outline-light"); // View resume button
const matteLightTexts = document.querySelectorAll(".text-matte-light");
const sections = document.querySelectorAll(".section");
const miscelllaneousElements = document.querySelectorAll("#main-container, body, footer");
let lightTexts, whiteBackgroundElements, offWhiteBackgroundElements, appIcons; // Programmatically added elements
// Toggles
const lightAppearanceToggle = document.getElementById("light-appearance");
const darkAppearanceToggle = document.getElementById("dark-appearance");
const autoAppearanceToggle = document.getElementById("auto-appearance");

lightAppearanceToggle.addEventListener("click", () => setPreferredAppearance("light"));
darkAppearanceToggle.addEventListener("click", () => setPreferredAppearance("dark"));
autoAppearanceToggle.addEventListener("click", () => setPreferredAppearance("auto"));

function getPreferredAppearance() {
    return window.localStorage.getItem("appearance");
}

function setPreferredAppearance(appearance) {
    switch (appearance.toLowerCase()) {
    case "light":
        toggleLightAppearance();
        break;
    case "dark":
        toggleDarkAppearance();
        break;
    case "auto":
        toggleAutoAppearance();
        break;
    default: return;
    }

    // Set active appearance toggle
    document.querySelectorAll('#appearance-toggle .nav li a.active')
        .forEach(toggle => toggle.classList.remove("active"));
    document.getElementById(`${appearance.toLowerCase()}-appearance`).classList.add('active');

    window.localStorage.setItem("appearance", appearance.toLowerCase());
}

function toggleLightAppearance() {
    navigationBar.classList.remove("navbar-dark");
    navigationBarTogglerBreadCrusts.forEach(crust => crust.style.backgroundColor = "var(--dark-bg-color)");
    blurBackgroundElements.forEach(background => background.style.backgroundColor = "var(--nav-background)");
    lightOutlineButtons.forEach(btn => {
        btn.classList.add("btn-outline-primary");
        btn.classList.remove("btn-outline-light");
    });
    matteLightTexts.forEach(text => text.classList.add("text-matte-dark"));
    sections.forEach(section => section.style.borderColor = "var(--light-bg-color)")
    miscelllaneousElements.forEach(element => element.style.backgroundColor = "var(--light-bg-color)");
    lightTexts.forEach(text => text.classList.add("text-dark"));
    whiteBackgroundElements.forEach(element => element.classList.remove("bg-off-black"));
    offWhiteBackgroundElements.forEach(element => element.classList.remove("bg-black"));
    appIcons.forEach(element => element.classList.remove("dark"));
}

function toggleDarkAppearance() {
    navigationBar.classList.add("navbar-dark");
    navigationBarTogglerBreadCrusts.forEach(crust => crust.style.backgroundColor = "var(--light-bg-color)");
    blurBackgroundElements.forEach(background => background.style.backgroundColor = "var(--nav-background-dark)");
    lightOutlineButtons.forEach(btn => {
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-outline-light");
    });
    matteLightTexts.forEach(text => text.classList.remove("text-matte-dark"));
    sections.forEach(section => section.style.borderColor = "black")
    miscelllaneousElements.forEach(element => element.style.backgroundColor = "var(--dark-bg-color)");
    lightTexts.forEach(text => text.classList.remove("text-dark"));
    whiteBackgroundElements.forEach(element => element.classList.add("bg-off-black"));
    offWhiteBackgroundElements.forEach(element => element.classList.add("bg-black"));
    appIcons.forEach(element => element.classList.add("dark"));
}

function toggleAutoAppearance() {
    const darkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)");
    // System appearance change listener (for "auto" only)
    darkModeEnabled.addEventListener("change", event => {
        if (getPreferredAppearance() == "auto")
            event.matches ? toggleDarkAppearance() : toggleLightAppearance()
    });
    // Set page appearance (one-time)
    darkModeEnabled.matches ? toggleDarkAppearance() : toggleLightAppearance()
}

function refreshAppearanceForProgrammaticallyAddedElements() {
    const appearance = getPreferredAppearance() ?? "auto";
    lightTexts = document.querySelectorAll(".text-light");
    offWhiteBackgroundElements = document.querySelectorAll(".bg-off-white, .bg-off-white2");
    whiteBackgroundElements = document.querySelectorAll(".bg-white");
    appIcons = document.querySelectorAll(".app-icon")
    setPreferredAppearance(appearance);
}

refreshAppearanceForProgrammaticallyAddedElements();
