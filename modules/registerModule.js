const User = require('../model/User')
const Joi = require('joi')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



exports.register = async (req,res,next) => {
    // User Input Validation - Joi Validation
    const schema = Joi.object({
        name: Joi.string().min(4).max(15).required(),
        email: Joi.string().min(6).max(50).email().required(),
        password: Joi.string().min(8).max(10).required(),
        
    })

    var {error} = await schema.validate(req.body);
    if (error) return res.status(400).send({msg : error.details[0].message});

    // Email already exists
    var existUser = await User.findOne({"email": req.body.email}).exec();
    if(existUser) return res.status(400).send({msg : "Email already exists"});

    // Create / register
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    var response = await user.save();
    res.send(response);
}


exports.login = async (req,res,next) => {
    // User Input Validation - Joi Validation
    const schema = Joi.object({
        email: Joi.string().min(6).max(50).email().required(),
        password: Joi.string().min(8).max(10).required()
    })
    var {error} = await schema.validate(req.body);
    if (error) return res.status(400).send({msg : error.details[0].message});

    // Is registerd User
    var existUser = await User.findOne({"email": req.body.email}).exec();
    if(!existUser) return res.status(400).send({msg : "Email not registered"})
    var user = {};
    user.username = existUser.username;
    user.name = existUser.name;
    user.email = existUser.email;
    user.address = existUser.address;

    // Password compare check
    const isValid = await bcrypt.compare(req.body.password, existUser.password);
    if(!isValid) return res.status(400).send({msg: "Password doesn't match"});

    // Generate Token
    var token = jwt.sign({user}, 'SWERA', {expiresIn: '1h'})
    res.send(token);
}