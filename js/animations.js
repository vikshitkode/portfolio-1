//
//  animations.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

const greetingSection = document.getElementById("greeting");
const introSection = document.getElementById("intro");
const skillsSection = document.getElementById("skills");
const projectsSection = document.getElementById("projects");
const contactSection = document.getElementById("contact");
const resumeSection = document.getElementById("resume");
const sourceCodeSection = document.getElementById("source-code");

//
// Intersection observers
//

const addIntersectionObserverFor = (element, callback) => {
    return new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    }).observe(element);
};

// Greeting section
addIntersectionObserverFor(greetingSection, (entries, observer) => {
    const memoji = document.querySelector("#greeting .memoji");
    const whiteTexts = document.querySelectorAll("#greeting .text-white");
    const learnMore = document.getElementById("learn-more");
    const initiallyHiddenElements = document.querySelectorAll("#greeting .initially-hidden");
    if (entries[0].isIntersecting) {
        memoji.style.animation = "slide_in 2s both 0.25s";
        whiteTexts.forEach(text => text.style.animation = "fade_in 2s both 0.5s");
        learnMore.style.animation = "slide_in_down 1s both 1.25s";
    } else {
        initiallyHiddenElements.forEach(element => element.style.animation = null);
    }
});

// Skills memoji container
const skillsMemojiContainer = document.querySelector("#skills .col .memoji-container");
addIntersectionObserverFor(skillsMemojiContainer, (entries, observer) => {
    const memojis = document.querySelectorAll("#skills .memoji");
    if (entries[0].isIntersecting == true) {
        memojis.forEach((memoji, index) => memoji.style.animation = `memoji-${index+1} 1s both 0.25s`);
    } else {
        memojis.forEach(memoji => memoji.style.animation = "fade_out 0.25s both");
    }
});

// Send icon
const sendIcon = document.getElementById("send-icon");
addIntersectionObserverFor(sendIcon, (entries, observer) => {
    if (entries[0].isIntersecting == true) {
        sendIcon.style.animation = "slide_diag_up 0.75s both 0.5s";
    } 
    // else {
    //     sendIcon.style.animation = null;
    // }
});

//
// Click listeners
//

const scrollIntoViewOptions = {
    behavior: "auto",
    block: "start"
};

// Go to top
document.getElementById("title").addEventListener("click", () => greetingSection.scrollIntoView(scrollIntoViewOptions));

// Go to intro section
document.querySelectorAll(".goto-intro").forEach(item => item.addEventListener("click", () => introSection.scrollIntoView(scrollIntoViewOptions)));

// Go to skills section
document.querySelector(".goto-skills").addEventListener("click", () => skillsSection.scrollIntoView(scrollIntoViewOptions));

// Go to projects section
document.querySelector(".goto-projects").addEventListener("click", () => projectsSection.scrollIntoView(scrollIntoViewOptions));

// Go to contact section
document.querySelector(".goto-contact").addEventListener("click", () => contactSection.scrollIntoView(scrollIntoViewOptions));

// Go to resume section
document.querySelector(".goto-resume")?.addEventListener("click", () => resumeSection.scrollIntoView({
    behavior: "auto",
    block: "center"
}));

// Go to source code section
// document.querySelector(".goto-source-code").addEventListener("click", () => sourceCodeSection.scrollIntoView(scrollIntoViewOptions));

//
// Plus go X!
//

function plusGoXHandler(event) {
    const easingFunction = "cubic-bezier(0.7, 0, 0.2, 1)";
    const checkbox = event.target;
    const label = checkbox.parentElement;
    const icon = label.querySelector("div");
    const container = label.parentElement;
    const tile = container.parentElement;
    const tileTitle = tile.querySelector("h5");
    const tileContent = tile.querySelectorAll(".tile-content");
    const tileOverlay = tile.querySelector(".tile-overlay");
    const tileOverlayBackground = tile.querySelector(".tile-overlay-background");

    if (icon.classList.contains("animating")) return;

    if (checkbox.checked) {
        icon.classList.add("animating");
        // Turn "+" into "x"
        icon.style.animation = `make_x 0.65s ${easingFunction} both 0.15s`;
        // Hide cover elements
        tileContent.forEach(element => {
            element.style.animation = "fade_out 0.45s both 0.25s";
        });
        setTimeout(() => {
            label.classList.add("checked");
            // Show content background
            tileOverlayBackground.style.animation = "fade_in 0.75s both";
            // Make title white
            tileTitle.classList.add("text-white-animated");
            // Show content
            tileOverlay.classList.remove("d-none");
            tileOverlay.style.animation = "slide_in_down 0.5s both";
            tileOverlay.classList.add("text-white-animated");
            icon.classList.remove("animating");
        }, 800);
    } else {
        icon.classList.add("animating");
        // Turn "x" into "+"
        icon.style.animation = `make_plus 0.65s ${easingFunction} both 0.15s`
        // Hide description text
        tileOverlay.style.animation = "slide_out_up 0.5s both"
        setTimeout(() => {
            // Hide overlay background
            tileOverlayBackground.style.animation = "fade_out 0.45s both 0.25s";
            // Show cover elements
            tileContent.forEach(coverElement => {
                coverElement.style.animation = "fade_in 0.45s both 0.25s";
            });
            tileOverlay.classList.remove("text-white-animated");
            tileOverlay.classList.add("d-none");
            setTimeout(() => {
                tileTitle.classList.remove("text-white-animated");
                label.classList.remove("checked");
                icon.classList.remove("animating");
            }, 250);
        }, 500);
    }
}

function contactPlusGoXHandler(event) {
    const sendIcon = document.querySelector("#contact #send-icon");
    if (event.target.checked) {
        sendIcon.style.animation = "slide_out_diag_up 0.75s both 0.25s";
        plusGoXHandler(event);
    } else {
        plusGoXHandler(event);
        setTimeout(() => sendIcon.style.animation = "slide_diag_up 0.75s both 0s", 750);
    }
}
