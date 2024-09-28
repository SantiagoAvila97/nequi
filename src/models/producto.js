const mongoose = require("mongoose")

const productoSchema = mongoose.Schema({
  nameSucursal: {
    type: String,
    required: true
  },
  refProducto: {
    type: String,
    required: true
  },
  priceProducto: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
})

module.exports = mongoose.model('Productos', productoSchema)
