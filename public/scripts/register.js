async function addRegsiterFunctionality() {
    const loginForm = document.querySelector('.js-register-form')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const username = formData.get("username")
        const password = formData.get("password")

        const res = await fetch("https://gki-app.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, username, password})
        })

        if (res.ok) {
            window.location.href = "https://gki-app.onrender.com/login"
            return
        }

        const data = await res.json()
        console.log(data.message)
    })
}

addRegsiterFunctionality()