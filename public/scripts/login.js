async function addLoginFunctionality() {
    const loginForm = document.querySelector('.js-login-form')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const password = formData.get("password")

        const res = await fetch("https://gki-app.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })

        if (res.ok) {
            window.location.href = "https://gki-app.onrender.com/"
            return
        }

        const data = await res.json()
        console.log(data)
    })
}

addLoginFunctionality()