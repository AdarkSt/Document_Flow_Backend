const Router = require("express")
const controller = require("./usersController")

const router = new Router()

router.get("/get_users", controller.getUsers)
router.post("/update_user", controller.updateUser)
router.delete("/delete_user", controller.deleteUser)
router.post("/create_user", controller.createUser)

module.exports = router