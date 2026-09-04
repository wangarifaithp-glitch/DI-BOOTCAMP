/* =====================================================
   PERIS WANGARI PORTFOLIO
   JavaScript
===================================================== */


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");


menuToggle.addEventListener("click", function () {

    sidebar.classList.toggle("open");

});


/* Close mobile menu when link is clicked */

const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        sidebar.classList.remove("open");

    });

});


/* =========================
   TYPING EFFECT
========================= */

const typingElement =
    document.getElementById("typing");


const words = [

    "Software Developer",
    "Web Developer",
    "Graphic Designer",
    "Creative Problem Solver",
    "Transcriptionist"

];


let wordIndex = 0;

let characterIndex = 0;

let deleting = false;


function typeEffect() {

    const currentWord =
        words[wordIndex];


    if (!deleting) {

        typingElement.textContent =
            currentWord.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex ===
            currentWord.length
        ) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;

        }

    } else {

        typingElement.textContent =
            currentWord.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

        }

    }


    const speed =
        deleting ? 60 : 100;


    setTimeout(typeEffect, speed);

}


typeEffect();


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
    document.querySelectorAll("section[id]");


function updateNavigation() {

    const scrollPosition =
        window.scrollY + 200;


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        const sectionId =
            section.getAttribute("id");


        if (
            scrollPosition >= sectionTop &&
            scrollPosition <
            sectionTop + sectionHeight
        ) {

            navLinks.forEach(function (link) {

                link.classList.remove("active");

            });


            const activeLink =
                document.querySelector(
                    `.nav-link[href="#${sectionId}"]`
                );


            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    });

}


window.addEventListener(
    "scroll",
    updateNavigation
);


/* =========================
   SKILL BARS
========================= */

const progressBars =
    document.querySelectorAll(".progress-bar");


function animateSkills() {

    const skillsSection =
        document.getElementById("skills");


    const sectionPosition =
        skillsSection.getBoundingClientRect().top;


    const screenPosition =
        window.innerHeight * 0.85;


    if (sectionPosition < screenPosition) {

        progressBars.forEach(function (bar) {

            bar.style.width =
                bar.getAttribute("data-width");

        });

    }

}


window.addEventListener(
    "scroll",
    animateSkills
);


/* =========================
   PORTFOLIO FILTER
========================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


const portfolioCards =
    document.querySelectorAll(".portfolio-card");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const filter =
            button.getAttribute("data-filter");


        portfolioCards.forEach(function (card) {

            const category =
                card.getAttribute("data-category");


            if (
                filter === "all" ||
                category === filter
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});


/* =========================
   BACK TO TOP
========================= */

const backToTop =
    document.getElementById("backToTop");


window.addEventListener(
    "scroll",
    function () {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }
);


backToTop.addEventListener(
    "click",
    function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");


const formMessage =
    document.getElementById("formMessage");


contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {

            formMessage.textContent =
                "Please fill in all fields.";

            formMessage.style.color =
                "#dc3545";

            return;

        }


        formMessage.textContent =
            `Thank you, ${name}! Your message has been prepared successfully.`;

        formMessage.style.color =
            "#159947";


        contactForm.reset();

    }
);


/* =========================
   SCROLL ANIMATION
========================= */

const animatedElements =
    document.querySelectorAll(
        ".service-card, .portfolio-card, .resume-item"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.1
        }
    );


animatedElements.forEach(function (element) {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity .6s ease, transform .6s ease";

    observer.observe(element);

});