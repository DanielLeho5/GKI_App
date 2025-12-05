async function addLoginFunctionality() {
    const loginForm = document.querySelector('.js-login-form')
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(loginForm)
        const email = formData.get("email")
        const password = formData.get("password")

        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })

        if (res.ok) {
            window.location.href = "http://localhost:5000/"
            return
        }

        const data = await res.json()
        console.log(data)
    })
}

addLoginFunctionality()