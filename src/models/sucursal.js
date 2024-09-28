const mongoose = require("mongoose")

const sucursalSchema = mongoose.Schema({
  nitFranquicia: {
    type: String,
    required: true
  },
  nameSucursal: {
    type: String,
    required: true
  },
  addressSucursal: {
    type: String,
    required: true
  },
  productos: {
    type: Array,
    required: false
  },
})

module.exports = mongoose.model('Sucursales', sucursalSchema)
