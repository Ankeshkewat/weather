const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const Redis = require('ioredis');

const UserRouter = express.Router();
const { UserModel } = require('../model/user.model')

const redis = new Redis({
    port: 12565,
    host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
    // db:0,
    // username:"default"
});


//signup
UserRouter.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(401).send({ 'msg': "Please give all fields" })
        } else {
            const hash_pass = bcrypt.hash(password, 5)
            let user = await new UserModel({ email, password });
            await user.save();
            res.status(201).send({ "msg": "Signup succesfull" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ 'msg': "Some error" })
    }
}
)

//login
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let data = await UserModel.find({ email });
    if (data.length > 0) {
        let hash_pass = data[0].password;
        bcrypt.compare(password, hash_pass, async function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({ "msg": "Someting went wrong" })
            }
            else {
                jwt.sign({ "userId": data[0]._id }, process.env.secret, async function (err, token) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ "msg": "Someting went wrong" })
                    }
                    else if (token) {
                        res.status(200).send({ "msg": "login succesfull", 'token': token })
                    }
                    else {
                        res.status(500).send({ "msg": "Someting went wrong" })
                    }
                })
            }
        })
    }
    else {
        res.status(401).send({ "msg": "Please login first" })

    }


})

//logout
UserRouter.post('/logout', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(401).send({ "msg": "You are not providing token" })
        } else {
          redis.set('token',token)
          res.status(200).send({'msg':"Logout succesfully"})
        }
    }
    catch (er) {
        console.log(er);
        res.status(500).send({ 'msg': "something went wrong" })
    }
})

module.exports = { UserRouter }