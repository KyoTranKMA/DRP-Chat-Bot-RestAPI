'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async( payload, publicKey, privateKey ) => {
    try {

        // private Key Param to sign when create JWT
        const accessToken = await JWT.sign( payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })
        // create refreshToken
        const refreshToken = await JWT.sign( payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30 days'
        })
        // public Key Param to verify JWT
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.err(`error verify `, err)
            }
            else{
                console.log(`decode verify`, decode)
            }
        })
        return { accessToken, refreshToken}
    }
    catch(error)
    {
        return error    
    }
}

module.exports = {
    createTokenPair
}