const host_url = window.location.origin

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

        const errDisplay = document.querySelector('.js-error-display')
        errDisplay.textContent = (data.message)
        errDisplay.style.visibility = "visible";
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