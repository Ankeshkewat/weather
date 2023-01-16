const Redis = require('ioredis');


const redis = new Redis({
  port: 12565,
  host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
  password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
  // db:0,
  // username:"default"
});

const logout_check = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    res.send({ 'msg': "you are not authorized to this" })
  }
  else {
    redis.get('token', function (err, result) {
      if (err) {
        console.log(err)
      } else {
        if (token == result) {
          res.status(401).send({ "msg": "Please login" })
        } else {
          next()
        }
      }
    })
  }

}
module.exports = (logout_check)