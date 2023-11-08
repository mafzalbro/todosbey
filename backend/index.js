const express = require('express')
const connectMongoDB = require('./db')
connectMongoDB()

const app = express()
const port = 8080

//Middleware to get json results like request body

app.use(express.json())


// Available Routes

app.use('/api/notes', require('./routes/notes.js'))
app.use('/api/auth', require('./routes/auth.js'))


app.get('/', (req, res) => {
  res.send({
    Started:"Added just to avoid not found error",
    Nothing:"Here",
    entrypoint1:"/api/auth/createuser",
    entrypoint2:"/api/notes",

  }) 
})

app.listen(port, () => {
  console.log(`Running port http://localhost:${port}`)
})
