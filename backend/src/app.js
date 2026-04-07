const express = require("express")
const cors = require("cors")
const app = express()
const authRoutes = require("../src/routes/authRoutes")
const adminRoutes = require("../src/routes/adminRoutes")

app.use(cors({credentials:false}))
app.use(express.json())
app.use('/',authRoutes)
app.use('/admin',adminRoutes)
app.use("/uploads", express.static("uploads"));

module.exports = app