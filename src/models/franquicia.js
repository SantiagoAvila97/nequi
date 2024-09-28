const mongoose = require("mongoose")

const franquiciaSchema = mongoose.Schema({
  nameFranquicia: {
    type: String,
    required: true
  },
  nitFranquicia: {
    type: Number,
    required: true
  },
  addressFranquicia: {
    type: String,
    required: true
  },
  sucursales: {
    type: Array,
    required: false
  },
})

module.exports = mongoose.model('Franquicias', franquiciaSchema)
