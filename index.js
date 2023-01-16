const express = require('express');
const cors = require('cors');


const app = express()
app.use(cors())
app.use(express.json())

const { UserRouter } = require('./router/user.router')
const { WeatherRouter } = require('./router/weather.router')
const { logout_check } = require('./middleware/logout_check')
const { connection } = require('./config/db')

app.post('/signup', UserRouter)
app.post('/login', UserRouter)
app.post('/logout', UserRouter)
app.get('/weather', WeatherRouter)


app.listen(1200, async () => {
    try {
        await connection
        console.log("connected to db");
        console.log('listening in post 1200')
    }
    catch (err) {
        console.log(err);

    }
})
