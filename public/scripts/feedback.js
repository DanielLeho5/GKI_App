import {host_url} from "./utils/settings.js"

function navBarLinks() {
    document.querySelector('.js-signin-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/login`})
    document.querySelector('.js-register-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/register`})
}

navBarLinks()