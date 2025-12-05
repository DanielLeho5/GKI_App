import {host_url} from "./utils/settings.js"

async function addLoginFunctionality() {
    const loginForm = document.querySelector('.js-login-form')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const password = formData.get("password")

        const res = await fetch(`${host_url}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })

        if (res.ok) {
            window.location.href = `${host_url}/`
            return
        }

        const data = await res.json()
        console.log(data)
    })
}

function navBarLinks() {
    document.querySelector('.js-register-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/register`})
    document.querySelector('.js-feedback-list-el').addEventListener("click", () => 
        {window.location.href = `${host_url}/feedback`})
}

navBarLinks()
addLoginFunctionality()