const User = require("./models/User")
const bcrypt = require('bcrypt');
const tokenService = require("./service/token-service");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const TokenSchema = require("./models/token-model")
dotenv.config()
// const {userDto} = require("./dtos/user-dto")

// {
//     "documents": [
      
//     ]
//   }

const UserDto = require("./dtos/user-dto");

class authController {
    async login(req, res){
        try{
            console.log("req.body", req.body)
            const {email, password} = req.body
            const user = await User.findOne({email:email})
            res.header("Access-Control-Allow-Origin", "*");
            console.log("user",user)

            if(!user) {
                return res.status(401).json({message: "mail is invalid"})
            }
            if(!password){
                return res.status(402).json({message: "bad request"})
            }
            const validPassword = await bcrypt.compare(password, user.password)
            
            if(!validPassword){
                return res.status(403).json({message:"wrong password"})
            }
            const userData = new UserDto(user)
            const tokens = tokenService.generateTokens({...userData})

            await tokenService.saveToken(userData.id, tokens.accessToken)
            const token = await TokenSchema.findOne({id:userData.id})
            

            // res.cookie("refreshToken", tokens.refreshToken, {maxAge: 1000*10, httpOnly:true})
            
            return res.json({token, userData})
        }
        catch(error){
            console.log(error)
            res.status(400).json({message: "Login Error"})
        }
    }

    async refresh(req, res){
        try{
            const refreshToken = req.cookies

            if(!refreshToken){
                res.status(404).json({message: "Login Error"}) 
            }
            
            const userData = tokenService.validateRefreshToken(refreshToken)
            const tokenFromDb = await tokenService.findToken(refreshToken)

            if(!userData || !tokenFromDb) {
                res.status(404).json({message: "Login Error"}) 
            }
            
            const user = await User.findById(userData.id)
            const userDto = new UserDto(user)
            const tokens = tokenService.generateTokens({userDto})

            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            
            res.cookie("refreshToken", tokens.refreshToken, {maxAge: 30* 24* 60 * 60 * 1000, httpOnly: true})
            return res.json({tokens})
        }
        catch (error) {

        }
    }
}

module.exports = new authController()