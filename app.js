const express = require('express')
const app = express()
const { getCategories } = require("./controllers/api.controllers")
app.use(express.json())

app.get('/api/categories', getCategories)



app.all('*',(req,res)=>{
    res.status(404).send({message:"invalid end point"})

})


app.use((error, req, res, next) => {
   
    res.status(error.status).send({ message: error.message })
})

module.exports = app

