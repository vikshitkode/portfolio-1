//
//  animations.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

import { $, $$ } from "./lib.js";

const greetingSection = $("#greeting");
const introSection = $("#intro");
const skillsSection = $("#skills");
const projectsSection = $("#projects");
const contactSection = $("#contact");
const sendIcon = $("#send-icon");

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
    if (entries[0].isIntersecting) {
        $("#greeting .memoji").style.animation = "slide_in 2s both 0.25s";
        $$("#greeting .text-white").forEach(text =>
            text.style.animation = "fade_in 2s both 0.5s"
        );
        $("#learn-more").style.animation = "slide_in_down 1s both 1.25s";
    } else {
        $$("#greeting .initially-hidden").forEach(element => 
            element.style.animation = "fade_out 0.5s both"
        );
    }
});

// Skills memoji container
addIntersectionObserverFor($("#skills .col .memoji-container"), (entries, observer) => {
    const memojis = $$("#skills .memoji");
    if (entries[0].isIntersecting == true) {
        memojis.forEach((memoji, index) => 
            memoji.style.animation = `memoji-${index+1} 1s both 0.25s`
        );
    } else {
        memojis.forEach(memoji => 
            memoji.style.animation = "fade_out 0.25s both"
        );
    }
});

// Send icon
addIntersectionObserverFor(sendIcon, (entries, observer) => {
    if (entries[0].isIntersecting) {
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
$("#title").addEventListener("click", () => 
    greetingSection.scrollIntoView(scrollIntoViewOptions)
);

// Go to intro section
$$(".goto-intro").forEach(item => 
    item.addEventListener("click", () => 
        introSection.scrollIntoView(scrollIntoViewOptions)
    )
);

// Go to skills section
$(".goto-skills").addEventListener("click", () =>
    skillsSection.scrollIntoView(scrollIntoViewOptions)
);

// Go to projects section
$(".goto-projects").addEventListener("click", () =>
    projectsSection.scrollIntoView(scrollIntoViewOptions)
);

// Go to contact section
$(".goto-contact").addEventListener("click", () =>
    contactSection.scrollIntoView(scrollIntoViewOptions)
);

//
// Plus go X!
//

window.plusGoXHandler = function(event) {
    const easingFunction = "cubic-bezier(0.7, 0, 0.2, 1)";
    const checkbox = event.target;
    const label = checkbox.parentElement;
    const icon = label.querySelector("div");
    
    if (icon.classList.contains("animating"))
        return;
    icon.classList.add("animating");
    
    const container = label.parentElement;
    const tile = container.parentElement;
    const tileTitle = tile.querySelector("h5");
    const tileContent = tile.querySelectorAll(".tile-content");
    const tileOverlay = tile.querySelector(".tile-overlay");
    const tileOverlayBackground = tile.querySelector(".tile-overlay-background");

    if (checkbox.checked) {
        // Turn "+" into "x"
        icon.style.animation = `make_x 0.65s ${easingFunction} both 0.15s`;
        // Hide cover elements
        tileContent.forEach(element => {
            element.style.animation = "fade_out 0.45s both 0.25s";
        });
        setTimeout(() => {
            // Make title white
            tileTitle.classList.add("text-white-animated");
            // Show overlay
            tileOverlay.classList.add("text-white-animated");
            tileOverlay.classList.remove("d-none");
            tileOverlay.style.animation = "slide_in_down 0.5s both";
            // Show overlay background
            tileOverlayBackground.style.animation = "fade_in 0.75s both";
            // Check
            label.classList.add("checked");
            // Animation finished
            icon.classList.remove("animating");
        }, 800);
    } else {
        // Turn "x" into "+"
        icon.style.animation = `make_plus 0.65s ${easingFunction} both 0.15s`
        // Hide overlay
        tileOverlay.style.animation = "slide_out_up 0.5s both"
        setTimeout(() => {
            tileOverlay.classList.add("d-none");
            tileOverlay.classList.remove("text-white-animated");
            // Hide overlay background
            tileOverlayBackground.style.animation = "fade_out 0.45s both 0.25s";
            // Show cover elements
            tileContent.forEach(coverElement => {
                coverElement.style.animation = "fade_in 0.45s both 0.25s";
            });
            setTimeout(() => {
                tileTitle.classList.remove("text-white-animated");
                // Uncheck
                label.classList.remove("checked");
                // Animation finished
                icon.classList.remove("animating");
            }, 250);
        }, 500);
    }
}

window.contactPlusGoXHandler = function(event) {
    plusGoXHandler(event);
    if (event.target.checked)
        sendIcon.style.animation = "slide_out_diag_up 0.75s both 0.25s";
    else setTimeout(() => 
        sendIcon.style.animation = "slide_diag_up 0.75s both 0s", 750
    );
}
