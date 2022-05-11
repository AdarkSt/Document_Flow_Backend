const {Schema, model} = require("mongoose")

const SenderDocs = new Schema({
    id: {type: String, required: true, unique:true},
    sender_email: {type: String, required: true, unique:false},
    data: {type: String, required: true, unique:false}
})

module.exports = model("SenderDocs", SenderDocs)