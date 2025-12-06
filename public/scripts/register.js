import {host_url} from "./utils/settings.js"

async function addRegsiterFunctionality() {
    const loginForm = document.querySelector('.js-register-form')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const username = formData.get("username")
        const password = formData.get("password")

        const res = await fetch(`${host_url}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, username, password})
        })

        if (res.ok) {
            window.location.href = `${host_url}/login`
            return
        }

        const data = await res.json()
        document.querySelector('.js-error-display').textContent = (data.message)
    })
}

function navBarLinks() {
    document.querySelector('.js-signin-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/login`})
    document.querySelector('.js-feedback-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/feedback`})
}

navBarLinks()
addRegsiterFunctionality()