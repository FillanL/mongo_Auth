const bcrypt = require('bcrypt')
const User = require('../Models/User');
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.genRefreshToken = async(req,res) =>{
    const refreshCookie  = req.cookies['jit']

    try {
        if(!refreshCookie) throw Error('no refresh Token, need to sign in')
        const payload = jwt.verify(refreshCookie,process.env.REFRESH_TOKEN,(err,decoded) => {
            if(err) throw Error('could not decode')
            else return decoded
        })
    
        if(payload.email && payload.userId){
            const user = await User.findOne({_id: payload.userId})
            if(payload.email !== user.email) throw Error('false cookie')
            if(!user) throw Error('no user by id')

            const refreshToken = jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                process.env.REFRESH_TOKEN,
                {
                    expiresIn:'1h'
                }
            )
            const accessToken = jwt.sign(
                {
                    email:user.email,
                    userId:user._id
                },
                process.env.LOG_SECRET,
                {
                    expiresIn:'1h'
                }
            )
            const dummyToken = jwt.sign(
                {
                    email:"dsdf",
                    userId:"ddummy"
                },
                process.env.DUMM || "sdf",
                {
                    expiresIn:'7d'
                }
            )
            res.cookie('hashed', dummyToken)
            res.cookie('jit',refreshToken)
            res.status(200).json({
                "accessToken": accessToken,
                "message":'user auth'
            })

        }else  throw Error('payload not there')
    } catch (error) {
        console.log(error)
        res.status(401).send({"error":error})
    }

}