const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const { validate } = require('./task')


const userSchema=new mongoose .Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        trim:true,
        validate(value){
            if(value<0){
                throw new Error('Age must be a postive number')
            }
        }
         },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
         },
         password:{
             type:String,
             required:true,
             trim:true,
             validate(value){
                 if(value.toLowerCase().includes('password')){
                     throw new Error('Password cannot contain "password"')
                 }
             }

         },
         tokens:[{
            token:{ type:String,
             required:true
            }
         }],

},
{
timestamps:true
}
)

userSchema.statics.findbycreditional=async(email,password)=>{
    const reporter=await Reporter.findOne({email})
    if(!reporter){
        throw new Error('invalid login')
    }
    const isMatch=await bcrypt.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('invalid login')
    }
       return reporter
}
userSchema.pre('save', async function (next) {
    const reporter = this

    if (reporter.isModified('password')) {
        reporter.password = await bcrypt.hash(reporter.password, 8)
    }

    next()
})
userSchema.methods.generateToken=async function(){
const user=this
const token=jwt.sign({_id:reporter._id.toString()},'news api')
reporter.tokens = user.tokens.concat({token:token})
await reporter.save()
return token
}
userSchema.methods.toJSON=function(){
    const reporter=this
    const reporterobject=reporter.toObject()
    delete reporterobject.password
    delete reporterobject.email
    return reporterobject
}
userSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})


const Reporter=mongoose.model('Reporter', userSchema)
module.exports=Reporter