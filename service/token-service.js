const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const tokenModel = require("../models/token-model")
dotenv.config()

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"})
        //const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_ACCESS_SECRET, {expiresIn: "30d"})

        return {
            accessToken,
            //refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch (error){
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_ACCESS_SECRET)
            return userData
        }
        catch (error){
            return null
        }
        
    }

    async saveToken(userId, token){
        const tokenData = await tokenModel.findOne({user: userId})
        console.log('tokenData', tokenData)
        if(tokenData) {
            tokenData.token = token
            return tokenData.save()
        }
        const tokenInDb = await tokenModel.create({user: userId, accessToken: token})
        console.log('tokenInDb', tokenInDb)
        return tokenInDb
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()
