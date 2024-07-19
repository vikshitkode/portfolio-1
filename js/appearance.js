//
//  appearance.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

import { $, $$ } from "./lib.js";

const navBar = $("#navbar");
const navBarTogglerBreadCrusts = $$("#navbar .navbar-toggler-bread-crust");
const blurBackgroundElements = $$(".bg-blur");
const lightOutlineButtons = $$(".btn-outline-light");
const miscelllaneousElements = $$("#main-container, body, footer");
const skillsTile = $("#skills .tile");

// Toggles
$("#light-appearance").addEventListener("click", () => setPreferredAppearance("light"));
$("#dark-appearance").addEventListener("click", () => setPreferredAppearance("dark"));
$("#auto-appearance").addEventListener("click", () => setPreferredAppearance("auto"));

NodeList.prototype.setBackgroundColor = function (s) {
    this.forEach(element => element.style.backgroundColor = s);
}
NodeList.prototype.addClass = function (c) {
    this.forEach(element => element.classList.add(c));
}
NodeList.prototype.removeClass = function (c) {
    this.forEach(element => element.classList.remove(c));
}

const isNavbarCollapsed = () => !navBar.classList.contains("not-collapsed");

const lightAppearance = () => {
    navBar.classList.remove("navbar-dark");
    navBarTogglerBreadCrusts.setBackgroundColor("var(--dark-secondary)");
    blurBackgroundElements.setBackgroundColor(isNavbarCollapsed() ? "var(--nav-background)" : "var(--light-secondary)");
    lightOutlineButtons.removeClass("btn-outline-light");
    lightOutlineButtons.addClass("btn-outline-primary");
    miscelllaneousElements.setBackgroundColor("var(--light-secondary)");
    skillsTile.style.background = "linear-gradient(145deg, white 10%, #ffa560 70%)";
    
    $$(".text-matte-light").addClass("text-matte-dark");
    $$(".text-light").addClass("text-dark");
    $$(".bg-light-secondary").removeClass("bg-dark-secondary");
    $$(".bg-light").removeClass("bg-dark");
    $$(".app-icon").removeClass("dark");
};

const darkAppearance = () => {
    navBar.classList.add("navbar-dark");
    navBarTogglerBreadCrusts.setBackgroundColor("var(--light-secondary)");
    blurBackgroundElements.setBackgroundColor(isNavbarCollapsed() ? "var(--nav-background-dark)" : "var(--dark-secondary)");
    lightOutlineButtons.removeClass("btn-outline-primary");
    lightOutlineButtons.addClass("btn-outline-light");
    miscelllaneousElements.setBackgroundColor("var(--dark-secondary)");
    skillsTile.style.background = "linear-gradient(145deg, var(--dark-secondary) 20%, #ff9442 70%)";
    
    $$(".text-matte-light").removeClass("text-matte-dark");
    $$(".text-light").removeClass("text-dark");
    $$(".bg-light-secondary").addClass("bg-dark-secondary");
    $$(".bg-light").addClass("bg-dark");
    $$(".app-icon").addClass("dark");
};

const darkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)");
const autoAppearance = () => {
    // System appearance change listener (for "auto" only)
    darkModeEnabled.addEventListener("change", event => {
        if (getPreferredAppearance() == "auto")
            event.matches ? darkAppearance() : lightAppearance()
    });
    // Set page appearance (one-time)
    darkModeEnabled.matches ? darkAppearance() : lightAppearance();
}

function getPreferredAppearance() {
    return window.localStorage.getItem("appearance") ?? "auto";
}

function setPreferredAppearance(appearance) {
    const preferredAppearance = appearance.toLowerCase();

    switch (preferredAppearance) {
        case "light":
            lightAppearance();
            break;
        case "dark":
            darkAppearance();
            break;
        case "auto":
        default:
            autoAppearance();
            break;
    }

    // Set active appearance toggle
    $$('#appearance-toggle .nav li a.active').removeClass("active");
    $(`#${preferredAppearance}-appearance`).classList.add('active');

    // Save preference to local storage
    window.localStorage.setItem("appearance", preferredAppearance);
}

export function refreshAppearance() {
    setPreferredAppearance(getPreferredAppearance());
}

refreshAppearance();

export function isDarkModeEnabled() {
    if (getPreferredAppearance() == "auto")
        return darkModeEnabled.matches;
    return getPreferredAppearance() == "dark";
}
