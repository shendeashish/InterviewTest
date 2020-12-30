const userModal= require('../model/userModal')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const config = require('config');
const jwtConfig = config.get('Jwt');

exports.createUser=(req,res,next)=>{
    let body= req.body;
    hashPassword(req.body.password).then(passwordString=>{
      body.password=passwordString;
      userModal.create(body).then(result=>{
        return res.status(200).json({
            message:'successfully added user'
        })

    }).catch(err=>{
        if(err.code === 11000){
        return res.status(502).json({
            message:'This Email address '+err.keyValue.email +' is Already exist',
        })    
        }

        res.status(502).json({
            message:'something went Wrong',
            err:err
        })
    })
    }).catch(err=>{})
    
}

function hashPassword(password) {
  return new Promise(function (resolve, reject) {
      bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
              reject(err);
          } else {
              resolve(hash);
          }
      });
  });
}




exports.listUser=(req,res,next)=>{
    let body= req.body;
    userModal.find({}).then(result=>{
        if(result.length == 0){

            return res.status(404).json({
                message:'No data Found',
                data:null
            })

        }else{
            return res.status(200).json({
                message:'Retrived all users succesfully ',
                data:result
            })
        }
    }).catch(err=>{
        return res.status(502).json({
            message:'Something went Wrong',
            err:err
        })
    })
}



exports.loginUser=(req,res,next)=>{
  let email = req.body.email;
  let password = req.body.password;
  console.log("email"+email,"password"+password);
  userModal.find({ 'email': email }).then(user => {
    if (user.length <= 0) {
      return res.status(404).json({
        message: "The email or password you entered is incorrect"
      });
    }else {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({
                user_id:user[0]._id,
                email: user[0].email,
                lastLogin:Date.now(),
                firstName: user[0].firstName,
                firstName: user[0].lastName,
            }, (jwtConfig.secretKey), { expiresIn: jwtConfig.expiresIn });
            

                userModal.findByIdAndUpdate(user[0]._id,{
                  $set:{lastLogin:Date.now()}
                },{new:true}).then(result=>{
                  return res.status(200).json({
                    message: "You have been successfully logged in",
                    data: {token:token}
                });

                }).catch(error=>{
                    console.log("error While login and updating the user",error);
                    return res.status(500).json({
                      message: "Something went wrong"
                  });
                });


        } else {
            return res.status(404).json({
                message: "The email or password you entered is incorrect"
            });
        }
    });
  }
  });

}