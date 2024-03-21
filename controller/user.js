exports.protectedRoute = (req,res) => {
    res.json({msg:'this is a protected route',user:req.user});
}