const navbar = document.querySelector(".js-navbar")
navbar.style.top = "0px"

const navbarHeight = getComputedStyle(navbar).height

let prevY = 0

window.addEventListener("scroll", () => {
    const diff = prevY - window.scrollY

    if (diff < 0) {
        navbar.style.top = Number(navbarHeight.slice(0, -2)) * -1 + "px"
        document.querySelector('.js-navigation-links').style.visibility = "hidden"
    } else if (diff > 0) {
        navbar.style.top = "0px"
    }

    prevY = window.scrollY
})

const navLinks = document.querySelector('.js-navigation-links')
document.querySelector('.js-nav-more').addEventListener('click', () => {
    if (window.getComputedStyle(navLinks).visibility === "hidden") {
        navLinks.style.visibility = "visible"
    } else {
        navLinks.style.visibility = "hidden"
    }
})