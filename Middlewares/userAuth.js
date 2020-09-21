const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    const token = req.headers.authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(token,process.env.LOG_SECRET)
        req.userData = decoded
        next()
    } catch (error) {
        res.status(401).send({message:"unAuth"})
    }
}