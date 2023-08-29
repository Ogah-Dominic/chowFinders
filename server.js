const express = require("express")
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const resturrantRouter = require("./router/resturrantRouter");
const fileUpload = require("express-fileupload");

const app = express()
app.use(cors())

app.use(express.json())
app.use(fileUpload({
    useTempFiles: true
}));
app.use(morgan("dev"));

app.use("/api/", resturrantRouter);
const DB = process.env.DATABASE
mongoose.connect(DB).then(()=>{
    console.log("Successfully connected to Database")
}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is now connected to ${process.env.PORT}`)
    })
})


app.get((req,res)=>{
    console.log("welcome message")
})