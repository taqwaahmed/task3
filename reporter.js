const express=require('express')
const router=new express.Router()
const Reporter=require('../models/reports')
const auth1=require('../middleware/auth1')


router.post('/reporter',async(req,res)=>{
const reporter=new Reporter(req.body)
try{
    await reporter.save()
    const token = await reporter.generateToken()
    res.status(201).send({reporter,token})
} catch (e) {
    res.status(400).send(e)
}
})
router.post('/reporter/login',async(req,res)=>{
    try{
      const reporter= await Reporter.findbycreditional(req.body.email,req.body.password)
      const token=await reporter.generateToken()
      res.status(200).send({reporter,token})

}catch(e){
    res.status(400).send(e)
}
})
router.get('/profile1',auth1,async(req,res)=>{
    res.send(req.reporter)
})
router.delete('/profile',auth1,async(req,res)=>{
   try{ await req.reporter.remove()
    res.send('deleted')
   }catch(e){
       res.status(400).send(e)
   }
})
router.patch('/profile',auth1,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','password']
    var isValid=updates.every((el)=>allowedUpdates.includes(el))
    if(!isValid) {
        return res.status(400).send('Can not update')
    }try{
        updates.forEach((update)=>(req.reporter[update]=req.body[update]))
        console.log(req.user)
       await req.reporter.save()
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/reporter/:id',(req,res)=>{
    const _id=req.params.id
    Reporter.findById(_id).then((reporter)=>{
        if(!reporter){
            return res.status(404).send('not found eporter')
        }
            res.status(200).send(reporter)
        
    }).catch((e)=>{
res.status(500).send('connection error')
    })
})
router.patch('/reporter/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','password']
    var isValid=updates.every((el)=>allowedUpdates.includes(el))
    if(!isValid) {
        return res.status(400).send('Can not update')
    }try{
        updates.forEach((update)=>(req.reporter[update]=req.body[update]))
        console.log(req.user)
       await req.reporter.save()
    }catch(e){
        res.status(400).send(e)
    }
})
router.delete('/reporter/:id',async(req,res)=>{
    const _id=req.params.id
    try{
        const reporter=await Reporter.findByIdAndDelete(_id)
          if(!reporter){
              return res.send('not found')
          }
          
     res.send('deleted')
    }catch(e){
        res.status(400).send(e)
    }
 })
 router.post('/logout',auth1,async(req,res)=>{
try{
    req.reporter.tokens=req.reporter.tokens.filter((el)=>{
        return el.token!==req.token
    })
    await req.reporter.save()
    res.send('logout succssesfully')
}  catch(e){
    res.status(500).send('please login')
}
})
 router.post('/logoutall',async(req,res)=>{
     try{
         req.reporter.token=[]
       await req.reporter.save()
         res.send('log out all')
     }catch(e){
        res.status(500).send('please login')
     }

 })
 module.exports=router
