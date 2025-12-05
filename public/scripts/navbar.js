const navbar = document.querySelector(".js-navbar")
navbar.style.top = "0px"

const navbarHeight = getComputedStyle(navbar).height

let prevY = 0

window.addEventListener("scroll", () => {
    const diff = prevY - window.scrollY

    if (diff < 0) {
        navbar.style.top = Number(navbarHeight.slice(0, -2)) * -1 + "px"
    } else if (diff > 0) {
        navbar.style.top = "0px"
    }

    prevY = window.scrollY
})
