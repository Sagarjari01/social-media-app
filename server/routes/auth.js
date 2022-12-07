const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const {JWT_SECRET,API_KEY} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require("nodemailer")
const sendGridTransport = require("nodemailer-sendgrid-transport")

const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:API_KEY
    }
}))

router.post('/signup', (req,res)=>{
    const {name, email, password, pic} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:"Please add all the fileds"})
    }
    User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
        return res.status(422).json({error:"User already Exists"})
       }
       bcrypt.hash(password, 12)
       .then(hashedPassword=>{
           const user = new User({
               email,
               name,
               password:hashedPassword,
               pic
           })
           user.save()
           .then(user=>{
               transporter.sendMail({
                   to:user.email,
                   from:"xiwos74875@kibwot.com",
                   subject:"Signup Successfully",
                   html:"<h1>Hello, there..! Welcom to Instagram</h1>"
               })
                res.json({message:"added Successfully"})
           })
           .catch(err=>{
               console.log(err)
           })
       })
   })
   .catch(err => {
       console.log(err)
   })
    
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const {_id, name, email, followers, following, pic} = savedUser
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token:token,user:{_id,name,email,followers,following, pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err => console.log(err))
    })
    
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                res.status(422).json({error:"User don't exists with the email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 360000
            user.save()
            .then(result=>{
                transporter.sendMail({
                    to:user.email,
                    from:"xiwos74875@kibwot.com",
                    subject:"password reset",
                    html:`<p>You requested for password reset</p>
                        <h5>click <a href="http://localhost:3000/reset/${token}">here</a> to reset tht password</h5>`
                })
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const sentToken = req.body.token
    const newpassword = req.body.password
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            res.status(422).json({error:"retry session expired"})
        }
        bcrypt.hash(newpassword,12).then(hashedPassword=>{
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then(saveduser=>{
                res.json({message:"Password updated successfully"})
            })

        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router