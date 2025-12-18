const host_url = window.location.origin

export async function logOutFunctionality() {
    document.querySelector('.js-logout-button').addEventListener('click', async () => {
        const res = await fetch(`${host_url}/api/auth/logout`, {
            method: "POST"
        })

        if (res.ok) {
            window.location.href = `${host_url}/login`
            return
        }
    })
}