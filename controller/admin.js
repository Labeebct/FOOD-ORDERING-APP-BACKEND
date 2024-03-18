const signupModel = require('../models/signup')
const {blockUser,unblockUser} = require('../utils/userBlockUnblock')

exports.postAdmin = async(req,res) => {
    try {
  
        //Finding all users and assigning to a variable to pass frontent
        const signupDatas = await signupModel.find()
        
        //Passing the datas
        res.status(200).json({signupDatas})
        
    } catch (error) {
        console.log('Error in get admin users',error);
    }
}  

exports.patchBlockUser = async(req,res) => {
    try {
        //Taking user id from query
        const userId = req.query.userId

        //Finding user to find the current status
        const user = await signupModel.findById(userId)

        if(!user) return res.status(404).json({msg:'User not Found'})

        const newStatus = user.status == 'active' ? 'blocked' : 'active'

        //Change status of user to Blocked
        const changeStatus = await signupModel.findOneAndUpdate({_id:userId},{$set:{status:newStatus}},{new:true})

        //Sending blocked email if user get blocked and unblocked mail if user unblocked
        if(newStatus == 'blocked') blockUser(user.userName,user.email)
        else unblockUser(user.userName,user.email)

        const setStatus = newStatus == 'active' ? 'BLOCKED' :  'UNBLOCKED'

        if(changeStatus.status == newStatus) return res.status(200).json({msg:'user block or unblock success',status:newStatus,setStatus})
        
    } catch (error) {
        console.log('Error in patch block user',error);
    }
}