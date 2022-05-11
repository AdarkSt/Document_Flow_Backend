const {Schema, model} = require("mongoose")

const Docs = new Schema({
    id: {type: String, required: true, unique:true},
    email: {type: String, required: true, unique:false},
    data: {type: String, required: true, unique:false}
})

module.exports = model("Docs", Docs)