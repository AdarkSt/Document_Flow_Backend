const {Schema, model} = require("mongoose")

const TokenSchema = new Schema({
    user: {type: String, required: true},
    accessToken: {type: String, required: true}
})

module.exports = model("tokenModel", TokenSchema)