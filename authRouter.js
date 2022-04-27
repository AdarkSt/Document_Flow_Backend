const Router = require("express")
const controller = require("./authController")

const router = new Router()

router.post("/login", controller.login)
router.get("/refresh", controller.refresh)

module.exports = router