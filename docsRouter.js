const Router = require("express")
const controller = require("./docsController")

const router = new Router()

router.post("/create_doc", controller.createDoc)
router.post("/get_resaved_docs", controller.getResavedDocs)
router.post("/get_sended_docs", controller.getSendedDocs)
router.post("/update_docs", controller.updateDoc)

module.exports = router