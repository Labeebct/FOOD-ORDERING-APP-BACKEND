const signupModel = require('../models/signup')


exports.postAdmin = async(req,res) => {
    try {
  
        //Finding all users and assigning to a variable to pass frontent
        const signupDatas = await signupModel.find()
        
        console.log(signupDatas);
        //Passing the datas
        res.status(200).json({signupDatas})
        
    } catch (error) {
        console.log('Error in get admin users',error);
    }
}  