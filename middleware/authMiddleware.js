const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.gkiToken

        if (!token) {
            return res.status(401).json({message: "No token provided!"})
        }

        let info;
        try {
            info = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            res.status(401).json({
                message: "Invalid or expired token!"
            })
            return
        }

        req.user = {id: info.id, email: info.email, username: info.username}

        next()
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
        return
    }
}

module.exports = {authMiddleware}