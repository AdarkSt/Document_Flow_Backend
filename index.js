const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./authRouter")
const bodyParser = require("body-parser")
const usersRouter = require("./usersRouter")

const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
dotenv.config()
const app = express()
const PORT =  process.env.PORT || 5000

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use(cookieParser())


const start = async() => {
    try{
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
    }
    catch(error){
        console.log(error)
    }
}
start()