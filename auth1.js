const jwt=require('jsonwebtoken')
const Reporter=require('../models/reports')
const auth1=async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)

        const decode = jwt.verify(token,'node course')
        console.log(decode)

        const reporter = await User.findOne({_id:decode._id , 'tokens.token':token})

        if(!reporter){
            throw new Error('Error has occurred')
        }

        req.reporter = reporter
        req.token=token
        next()

    }catch(e){
        res.status(401).send({
            error:'Please authentictae'
        })

    }

}

module.exports = auth1