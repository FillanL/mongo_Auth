const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

module.exports = (req, res, next)=>{
    console.log(req.cookies)
    
    const token = req.headers.authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(token,process.env.LOG_SECRET)
        req.userData = decoded
        next()
    } catch (error) {
        const refreshCookie  = req.cookies['jit']

        console.log(refreshCookie, "failed but cookie")

        if(refreshCookie) res.status(401).send({isAuth:false,refresh:true})
        else res.status(401).send({isAuth:false,refresh:false})
    }
}