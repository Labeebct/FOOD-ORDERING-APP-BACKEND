const bcrypt = require('bcrypt')
const otpGenerator = require('../utils/otpGenarator')

const signupModel = require('../models/signup')
const emailOtp = require('../utils/emailVerify')

let signupOTP;

exports.postSignup = async (req, res) => {
    try {

        //Regex to match
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //Destructuring datas from body
        const { userName, email, password, confirmPassword } = req.body

        //Validating user datas
        if (!userName, !email, !password, !confirmPassword) {
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
        }
        else if (password !== confirmPassword) {
            return res.status(422).json({ msg: 'Password mismatch' })
        }
        else {

            //Checking whether user exist or not
            const userExist = await signupModel.findOne({email})

            //Calling OTP function to get random otp each type
            signupOTP = otpGenerator()
            

            if(userExist) {

                //Checking whether user verified or not
                if(userExist.verified) return res.status(409).json({msg:'User already Exist',userExist:true})   
                else{
                //Sending otp to the users email for verification
                emailOtp(userName,email,signupOTP)
                return res.status(401).json({msg:'User is not verified',userVerified:false,email})   
                }
            } else {

            //Salting and Hashing password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //Overriding the password to hashedpassword and saving datas in database
            req.body.password = hashedPassword
            delete req.body.confirmPassword
            await signupModel.create(req.body)

            //Sending otp to user email for verification and passing success msg to frontent after saving user data
            emailOtp(userName,email,signupOTP)
            res.status(200).json({msg: 'Registration success',registered:true,email})
            }

        }
    } catch (error) {
        console.log('Error in post signup',error);
        res.status(500).send('Internal server error 666')
    }
}

exports.postOtpverification = async(req,res) => {
    try {
        //Collecting email to find the user to verify
        const email = req.params.email
        
        //Destructuring otp values from body
        const {otpValue} = req.body
     
        //Validating otp
        if(otpValue.length == 0 || otpValue.length < 4){
            return res.status(422).json({msg:'Please provide otp'})
        }

        //Checking whether user otp matches with created otp
        if(otpValue != signupOTP){
            return res.status(409).json({msg:'Invalid OTP'})
        }
        else{
            //Verifying user if otp matches
            const veryfyUser = await signupModel.findOneAndUpdate({email},{$set:{verified:true}},{new: true})

            //Making sure whether verification success or not
            if(veryfyUser.verified) return res.status(200).json({msg:'Verification success'})
            else return res.status(403).json({msg:'Verification Failed'})
        }
        
    } catch (error) {
        console.log('Error in post otp verification',error);
        res.status(500).send('Internal Server error')
    }
}