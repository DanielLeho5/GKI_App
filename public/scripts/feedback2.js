import {host_url} from "./utils/settings.js"

function navBarLinks() {
    document.querySelector('.js-dashboard-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/`})
}

navBarLinks()