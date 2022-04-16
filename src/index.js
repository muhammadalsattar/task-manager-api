const app = require('./app')

app.listen(process.env.PORT, ()=>{
    console.log('Server is up! Listening on port: ' + process.env.PORT)
})