require("dotenv").config();
const connectDB = require("./db/connect")
const productsJson = require('./products.json')
const Product = require("./models/product")

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(productsJson)
        console.log("Success")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
