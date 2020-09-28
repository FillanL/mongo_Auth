const bcrypt = require('bcrypt')
const User = require('../Models/User');
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.createUser = async (req, res)=>{
    const {password, userName, email} = req.body
    try {
        const existingUser = await User.findOne({"userName":userName})
        const existingEmail = await User.findOne({"email":email})
        if(existingEmail) return res.status(409).send({message:"email already exist"})
        if(existingUser) return res.status(422).send({message:"user already existing"})

        await bcrypt.hash(password, 10,(err,hash)=>{
            if(err) res.status(500).send({error:err})

            const user = new User({
                "userName": userName,
                "password": hash,
                "email": email
            })
            user.save()
            .then(savedUser => res.status(201).send({"message":"user created","id":savedUser._id}))
            .catch(error => res.status(422).json(error))
        });

    } catch (err) {
        res.status(400).send(err)
    }
    // console.log("still runns after?")
}

exports.logIn = async(req,res) =>{
    const { password, userName } = req.body
    // res.cookie('v', 'cngvmb')
    try {
        const user = await User.findOne({"userName":userName})
        if(!user)throw new Error("user not Found");
        // console.log(!user)

        await bcrypt.compare(password,user.password, (error, result)=>{
            console.log(error,result)
            if(error) res.status(500).send({message:"error validating cred"})
            if(!result) res.status(500).send({message:"cred is invalid "})
            if(result){
                console.log("here", result)
                const accessToken = jwt.sign(
                    {
                        email:user.email,
                        userId:user._id
                    },
                    process.env.LOG_SECRET,
                    {
                        expiresIn:'30s'
                    }
                )
    
                const refreshToken = jwt.sign(
                    {
                        email:user.email,
                        userId:user._id
                    },
                    process.env.REFRESH_TOKEN,
                    {
                        expiresIn:'7d'
                    }
                )
                const dummyToken = jwt.sign(
                    {
                        email:"dsdf",
                        userId:"ddumm"
                    },
                    process.env.DUMM || "sdf",
                    {
                        expiresIn:'7d'
                    }
                )
                // const refresh = 
                res.cookie('hashed', dummyToken)
                res.cookie(
                    'jit', refreshToken, {
                    httpOnly:true
                })
                console.log(res.cookie['jit'], res.cookies)
    
                res.status(200).json({
                    "message":'user auth',
                    "token": accessToken
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({"error":error})
    }
}

exports.findUserById = async(req,res) =>{
    const {userId} = req.body
    console.log(req.body , 'here')
    try {
        const user = await User.findById(userId)
        if(user._id.toString() === userId){
            res.send(user).status(200)
        }else res.send({errorDetails:"user is not found"}).status(200)
    } catch (error) {
        res.send({error}).status(400)
    }
    // console.log("finduser")
}
exports.findUserByEmail = async(req,res) =>{
    const { email } = req.body
    try {
        const user = await User.findOne("email",email)
        if(user._id === userId){
            res.send(user).status(200)
        }else res.send({errorDetails:"user is not found"}).status(200)
    } catch (error) {
        res.send({error}).status(400)
    }
    console.log("finduser")
}