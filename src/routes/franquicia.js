const express = require("express")
const franquiciaSchema = require("../models/franquicia")

const router = express.Router()
const path = "/franquicia"

// Agregar nueva franquicia
router.post(`${path}/create`, (req, res) => {
  const { nitFranquicia, nameFranquicia } = req.body;

  franquiciaSchema.findOne({ $or: [{ nitFranquicia }, { nameFranquicia }] })
    .then((existingFranquicia) => {
      console.log(req.body);

      console.log(existingFranquicia);

      if (existingFranquicia) {
        return res.status(400).json({
          error: 'Ya existe una franquicia con ese NIT o nombre.',
        });
      }

      return franquiciaSchema({ ...req.body, sucursales: [] })
        .save()
        .then((response) => res.status(201).json(response))
        .catch((error) =>
          res.status(500).json({
            error: 'Error al guardar en la base de datos',
            details: error.message,
          })
        );
    })
    .catch((error) => res.status(500).json({ error: 'Error en la validación', details: error.message }));
});

module.exports = router
