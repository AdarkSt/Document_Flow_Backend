const User = require("./models/User")
const dotenv = require("dotenv")
const bcrypt = require('bcrypt');

dotenv.config()

const UserDto = require("./dtos/user-dto")

class usersController {
    async getUsers(req, res){
        try{
            const users = await User.find({})
            res.header("Access-Control-Allow-Origin", "*");
            if(!users){
                return res.status(404).json({message: "something went wrong"})
            }
            const filteredUsers = []
            users.forEach(user => {
                filteredUsers.push(new UserDto(user))
            })
            return res.json({filteredUsers})
        }
        catch (error){
            console.log(error)
            res.status(405).json({message: "dataBase Error"})
        }
    }

    async updateUser(req, res){
        try{
            res.header("Access-Control-Allow-Origin", "*");
            const newUser = req.body
            const userFromDB = await User.findOneAndUpdate({email:newUser.email}, newUser)
            if(!userFromDB){
                return res.status(404).json("user not found")
            }
            return res.status(200).json({message:"updated successfuly"})
        }
        catch (error) {
            return res.status(401).json({message:"something whent wrong"})
        }
    }

    async deleteUser(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const deletableUser = req.body
            const userFromDB = await User.findOneAndDelete({email:deletableUser.email})
            if(!userFromDB) {
                return res.status(404).json("user not found")
            }
            return res.status(200).json({message: "deleted successfuly"})
        }
        catch (error) {
            console.log("error", error)
            return res.status(401).json({message: "something whent wrong"})
        }
    }

    async createUser(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const newUser = req.body
            const password_non_hash = newUser.password
            newUser.password = await bcrypt.hash(password_non_hash, 10)
            const newValidUser = {...newUser, password_non_hash}
            const createdUser = await User.create(newValidUser)
            if(!createdUser){
                return res.status(401).json({message: "bad request"})
            }
            return res.status(200).json()
        }
        catch (error) {
            return res.status(404).json({message: "something whent wrong"})
        }
    }
}

module.exports = new usersController()