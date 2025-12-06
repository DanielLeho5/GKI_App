import {host_url} from "./utils/settings.js"
import { logOutFunctionality } from "./utils/logOut.js"

function navBarLinks() {
    document.querySelector('.js-dashboard-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/`})
}

logOutFunctionality()
navBarLinks()