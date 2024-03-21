const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    try {

        const token = req.header('auth-token');
        if(!token) return res.status(401).json({msg:'Access denied'})

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verified
        next()
        
    } catch (error) {
        console.log('Error in json token verification',error);
    }
}

module.exports = verifyToken    