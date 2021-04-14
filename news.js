const mongoose=require('mongoose')
 const newsSchema=new mongoose.Schema(
     {
         title:{
             type:String,
             trim:true
         },
         description:{
             type:String,
             trim:true
         },
         owner:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'Reporter'
         }
     },
     {
         timestamps:true
     }
 )
 const news=mongoose.model('News',newsSchema)
 module.exports=news