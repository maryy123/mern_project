const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User=require('../models/User')

// register
exports.Register=async(req,res)=>{
   try {
       const {email,password}= req.body
       const findUser=await User.findOne({email})
    //    verify that the email is unique
       if(findUser){
           return res.status(400).send({ errors: [{ msg: "email should be unique!" }] });
       }

       
    //   if email is unique then create new user
    else{   const newUser=new User({...req.body,seller:{name:req.body.name,description:req.body.description,location:req.body.location,phone:req.body.phone}})

    // hashedpassword
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    newUser.password = hashedpassword;

    //save user
    await newUser.save();
    
    // create a token (key with time expiration)
    const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );

      // response
      res.status(200).send({ msg: "register succ", user: newUser, token });}
   } 
   catch (error) {
    console.log("err:",error);
    res.status(500).send({ errors: [{ msg: "user can not be saved!" }]});
   }
}

exports.Login = async (req, res) => {
    try {
      // get email & password
      const { email, password } = req.body;

      //   verify if the email is existed in the DB
      const findUser = await User.findOne({ email });
      
      //if not then err msg
      if (!findUser) {
        return res.status(400).send({ errors: [{ msg: "bad credential" }] });
      }
      
      // test if password is valid (exists in DB)
      const comparePass = await bcrypt.compare(password, findUser.password);
      
      ////if not then err msg
      if (!comparePass) {
        return res.status(400).send({ errors: [{ msg: "bad credential" }] });
      }

      // create token(key (type:object) with expiration time that could be modified)
      const token = jwt.sign(
        {
          id: findUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );

      res.status(200).send({ msg: "login successfully", user: findUser, token });
      
    } catch (error) {
      res.status(500).send({ errors: [{ msg: "can not login" }] });
    }
  };
  