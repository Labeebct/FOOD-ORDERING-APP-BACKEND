const bcrypt = require('bcrypt')
const otpGenerator = require('../utils/otpGenarator')

const signupModel = require('../models/adminSignup')

//Regex to Validate
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.postSignup = async(req,res) => {
    try {

        //Admin uniqe secret key to register datas
        const scecret = process.env.ADMIN_SECRET

        //Destructuring datas from body
        const { userName, email, password, secretKey } = req.body      
        
        //Validating admin datas
        if (!userName, !email, !password, !secretKey) {
        return res.status(422).json({ msg: 'Please fill all fields' })
        }
        else if (userName.trim().length < 4) {
            return res.status(422).json({ msg: 'Username should be more than 4 character' })
        }
        else if (!emailRegex.test(email)) {
            return res.status(422).json({ msg: 'Invalid email format' })
        }
        else if (!passwordRegex.test(password)) {
            return res.status(422).json({ msg: 'Please profide a strong password' })
        } else {

            //Checking whether user exist or not
            const userExist = await signupModel.findOne({email})

            if(userExist) {
                return res.status(409).json({msg:'User Already Exist',userExist:true})
            } else {
    
                //Checking whether secret keys are matching
                if(secretKey == scecret){

                //Salting and Hashing password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                //Overriding the password to hashedpassword and saving datas in database
                req.body.password = hashedPassword
                delete req.body.secretKey
                await signupModel.create(req.body)
                return res.status(200).json({msg: 'Registration success'})

                } else {
                    return res.status(401).json({msg:'Incorrect Secret Key'})
                }
            }
        }
  
    } catch (error) {
        console.log('Error in post signup',error);
        res.status(500).send('Internal server error')

    }
}

exports.postLogin = async(req,res) => {
    try {


        
    } catch (error) {
        console.log('Error in post login',error);
    }
}