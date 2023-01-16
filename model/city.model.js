const mongoose=require('mongoose');


const CityModel=mongoose.model('city',mongoose.Schema({
       city:String,
       user_id:String
}));

module.exports={CityModel}