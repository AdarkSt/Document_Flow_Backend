const {Schema, model} = require("mongoose")

const User = new Schema({
    email: {type: String, unique: true, required:true},
    password: {type: String, required: true},
    password_non_hash: {type: String, required: true},
    id: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    position: {type: String, required: true},
    role: {type:String, required:true}
})

module.exports = model("User", User)