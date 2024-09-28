const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()
const franquiciRoutes  = require("./routes/franquicia")
const sucursalRoutes = require("./routes/sucursal")
const productoRoutes = require("./routes/producto")

const port = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())
app.use("/api", franquiciRoutes)
app.use('/api', sucursalRoutes);
app.use('/api', productoRoutes);

app.get('/', (req, res) => {
  res.send("Pin route")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then((db) => console.log("Connected Mongo DB"))
  .catch((error) => console.error(error));


app.listen(port, () => {
  console.log(`Pin ${port}`);
})
