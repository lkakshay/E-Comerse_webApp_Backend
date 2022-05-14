const { body, validationResult } = require('express-validator')
const User=require('../../models/userModel')


const registerValidator=[
    body('first_name').isString().isLength({min:3,max:30}),
    body('last_name').isString().isLength({min:1,max:30}),
    body('mobile').isNumeric(),
    body('email').isEmail().bail()
        .custom(async(value)=>{
            const user = await User.findOne({email:value}).lean().exec()
            if(user)
                throw new Error("user already exist")
            else
                return true

        }),
    body('password').isString().isLength({min:8,max:20}).bail()
        .custom(async(value)=>{
            const  pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            if(pattern.test(value))
                return true 
            else
                throw new Error("user already exist")
        })    
]

const registerValidatorResult=(req,res,next)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
    return res.status(400).json({ errors: errors.array()})
    else
    next()

}


module.exports={registerValidator,registerValidatorResult}