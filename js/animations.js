//
//  animations.js
//  portfolio
//
//  Created by Foxster on 2022-09-23.
//  Copyright (c) 2022 Foxster. All rights reserved.
//

import { $, $$ } from "./lib.js";
import { isDarkModeEnabled } from "./appearance.js";

const greetingSection = $("#greeting");
const introSection = $("#intro");
const skillsSection = $("#skills");
const projectsSection = $("#projects");
const contactSection = $("#contact");
const sendIcon = $("#send-icon");

// let texts = ["Huy Bui", "therealFoxster"];
// let index = 0;
// let text = "";
// let isDeleting = false;
// let timerId;
// const titleText = $("#title>span");

// function typeText() {
//     if (text.length < texts[index].length) {
//         text += texts[index][text.length];
//         titleText.innerText = text;
//     } else {
//         titleText.classList.add("not-typing");
//         clearInterval(timerId);
//         setTimeout(() => {
//             isDeleting = true;
//             timerId = setInterval(deleteText, 100); // Delete speed
//         }, 9000); // Wait time
//     }
// }

// function deleteText() {
//     if (text.length > 0) {
//         titleText.classList.remove("not-typing");
//         text = text.slice(0, -1);
//         titleText.innerText = text;
//     } else {
//         clearInterval(timerId);
//         isDeleting = false;
//         index = (index + 1) % texts.length;
//         timerId = setInterval(typeText, 150);
//     }
// }

// timerId = setInterval(typeText, 150); // Type speed

const navbar = $("#navbar");
const navbarContent = $("#navbar-content");
const title = $("#title");
const mainContainer = $("#main-container");

navbarContent.addEventListener("show.bs.collapse", function () {
    document.body.style.overflow = 'hidden'; // Prevent scrolling when navbar is visible
    title.style.pointerEvents = "none";
    title.style.animation = "fade_out 0.25s ease-in-out both";
    navbarContent.classList.remove('collapsing-out');
    navbarContent.classList.add('collapsing-in');
    navbar.style.backgroundColor = isDarkModeEnabled() ? "var(--dark-secondary)" : "var(--light-secondary)";
    navbar.classList.add("not-collapsed");
    mainContainer.style.opacity = 0;
});

navbarContent.addEventListener("hide.bs.collapse", function () {
    document.body.style.overflow = 'auto';
    title.style.pointerEvents = "auto";
    title.style.animation = "fade_in 0.25s 0.25s ease-in-out both";
    navbarContent.classList.remove('collapsing-in');
    navbarContent.classList.add('collapsing-out');
    setTimeout(() => {
        navbar.style.backgroundColor = isDarkModeEnabled() ? "var(--nav-background-dark)" : "var(--nav-background)";
    }, 100);
    navbar.classList.remove("not-collapsed");
    mainContainer.style.opacity = 100;
});

// Collapse navbar when mobile settings no longer applies
window.addEventListener('resize', function () {
    if (window.innerWidth >= 576) {
        var navbarContent = $("#navbar-content");
        var bsCollapse = new bootstrap.Collapse(navbarContent, { toggle: false });
        bsCollapse.hide();
    }
});

NodeList.prototype.setAnimation = function (a) {
    this.forEach(e => e.style.animation = a);
}

//
// Intersection observers
//

const addIntersectionObserverFor = (element, callback) => {
    return new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    }).observe(element);
};

// Greeting section
addIntersectionObserverFor(greetingSection, (entries, observer) => {
    if (entries[0].isIntersecting) {
        $("#greeting .memoji").style.animation = "slide_in 2s both 0.25s";
        $$("#greeting .text-white").setAnimation("fade_in 2s both 0.5s");
        // $("#learn-more").style.animation = "slide_in_down 1s both 1.25s";
    } else {
        // $$("#greeting .initially-hidden").forEach(element =>
        //     element.style.animation = "fade_out 0.5s both"
        // );
    }
});

// Technologies
addIntersectionObserverFor($("#skills .row .col"), (entries, observer) => {
    const rows = $$(".technologies-row");
    if (entries[0].isIntersecting) {
        if (window.matchMedia("(max-width: 767px)").matches) {
            // Mobile
            // rows.setAnimation("scroll-mobile 90s linear infinite");
            rows.forEach((row, i) => {
                row.style.animation = `scroll-mobile ${60 * (3 - i) / 2}s linear infinite`;
            });
        } else {
            // rows.setAnimation("scroll 90s linear infinite");
            rows.forEach((row, i) => {
                row.style.animation = `scroll ${60 * (3 - i) / 2}s linear infinite`;
            });
        }
    } else {
        rows.setAnimation("none");
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
$$(".goto-contact").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        contactSection.scrollIntoView(scrollIntoViewOptions);
    });
});

//
// Plus go X!
//

window.plusGoXHandler = function (event) {
    const easingFunctions = [
        "cubic-bezier(0.7, 0, 0.2, 1)",
        "cubic-bezier(0.66, 0, 0.01, 1)",
        "cubic-bezier(0.66, 0, 0.2, 1)"
    ];

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
        icon.style.animation = `make_x 0.65s ${easingFunctions[0]} both`;
        // Make title white
        tileTitle.classList.add("text-white-animated");
        setTimeout(() => {
            // Hide cover elements
            tileContent.setAnimation("fade_out 0.45s both");
            // Show overlay background
            tileOverlayBackground.style.animation = `fade_in 0.65s ${easingFunctions[1]} both`;
            // Checked
            label.classList.add("checked");
            setTimeout(() => {
                // Show overlay
                tileOverlay.classList.add("text-white-animated");
                tileOverlay.classList.remove("d-none");
                tileOverlay.style.animation = `slide_in_down 0.65s ${easingFunctions[2]} both`;
                // Animation finished
                icon.classList.remove("animating");
            }, 650);
        }, 100);
    } else {
        // Turn "x" into "+"
        icon.style.animation = `make_plus 0.65s ${easingFunctions[0]} both`;
        // Hide overlay
        tileOverlay.style.animation = `slide_out_up 0.65s ${easingFunctions[2]} both`;
        setTimeout(() => {
            tileOverlay.classList.add("d-none");
            tileOverlay.classList.remove("text-white-animated");
            // Hide overlay background
            tileOverlayBackground.style.animation = `fade_out 0.65s ${easingFunctions[1]} both`;
            // Show cover elements
            tileContent.setAnimation("fade_in 0.55s both 0.15s");
            // Make title colored
            tileTitle.classList.remove("text-white-animated");
            setTimeout(() => {
                // Unchecked
                label.classList.remove("checked");
                // Animation finished
                icon.classList.remove("animating");
            }, 150);
        }, 650);
    }
}

window.contactPlusGoXHandler = function (event) {
    plusGoXHandler(event);
    if (event.target.checked)
        sendIcon.style.animation = "slide_out_diag_up 0.75s both 0s";
    else setTimeout(() =>
        sendIcon.style.animation = "slide_diag_up 0.75s both 0s", 750
    );
}
