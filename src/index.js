
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";



dotenv.config({
  path: "./env",
})



connectDB()






/*
import express from "express"
const app = express()
(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",() => {
        console.log("ERROR: ",error);
        throw error
       })

       app.listen(process.env.PORT,() => {
        console.log("ERROR: ",error);
        throw error
       })

    } catch (error) {
        console.error("ERROR:", error)
        throw error
    }
}) ()
    */
