const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const Redis = require('ioredis');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const WeatherRouter = express.Router();
const { CityModel } = require('../model/city.model')
const { UserModel } = require('../model/user.model')

const redis = new Redis({
    port: 12565,
    host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
    // db:0,
    // username:"default"
});

WeatherRouter.get('/weather', async (req, res) => {

    try {
        let token = req.headers?.authorization?.split(' ')[1]
        if (!token) {
            res.status(401).send({ "msg": "Your not authorize" })
        } else {
            jwt.verify(token, process.env.secret, async (err, dec) => {
                if (err) {
                    res.status(500).send({ 'msg': "something went wrong" })
                }
                else {
                    const city = req.query?.city;
                    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},uk&APPID=8ca4126c3caaf8da2149abd49d58ccc2`)
                    let data = await response.json()
                    let new_city = await CityModel({ city });
                    await new_city.save();
                    res.status(200).send({ 'msg': data })
                }
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ 'msg': "something went wrong" })
    }
})


module.exports = { WeatherRouter }

