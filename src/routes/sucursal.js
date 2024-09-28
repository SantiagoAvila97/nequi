const express = require("express");
const franquiciaSchema = require("../models/franquicia");
const sucursalSchema = require("../models/sucursal");
const productoSchema = require("../models/producto");

const router = express.Router();
const path = "/sucursal";

// Crear nueva sucursal, asociada a una franquicia
router.post(`${path}/create`, (req, res) => {
  const { nitFranquicia, nameSucursal } = req.body;

  franquiciaSchema.findOne({ nitFranquicia })
    .then((franquicia) => {
      if (!franquicia) {
        return franquiciaSchema.find()
          .then((franquicias) => {
            const franquiciaList = franquicias.map((f) => ({
              nitFranquicia: f.nitFranquicia,
              nameFranquicia: f.nameFranquicia,
            }));
            return res.status(400).json({
              error: 'La franquicia no existe. Estas son las franquicias disponibles:',
              availableFranquicias: franquiciaList,
            });
          })
          .catch((error) => res.status(500).json({ error: 'Error al obtener las franquicias', details: error.message }));
      }

      sucursalSchema.findOne({ nameSucursal })
        .then((sucursalExistente) => {
          if (sucursalExistente) {
            return res.status(400).json({
              error: 'Ya existe una sucursal con ese nombre',
            });
          }

          sucursalSchema({...req.body, productos: []})
            .save()
            .then((sucursalCreada) => {
              franquicia.sucursales.push(sucursalCreada._id);
              franquicia.save()
                .then(() => res.status(201).json({
                  message: 'Sucursal creada y agregada a la franquicia',
                  sucursal: sucursalCreada,
                  franquicia,
                }))
                .catch((error) =>
                  res.status(500).json({
                    error: 'Error al actualizar la franquicia con la nueva sucursal',
                    details: error.message,
                  })
                );
            })
            .catch((error) =>
              res.status(500).json({
                error: 'Error al guardar la sucursal en la base de datos',
                details: error.message,
              })
            );
        })
        .catch((error) => res.status(500).json({ error: 'Error al verificar el nombre de la sucursal', details: error.message }));
    })
    .catch((error) => res.status(500).json({ error: 'Error al validar la franquicia', details: error.message }));
});

// Obtener todos los productos de una sucursal y el que tiene más stock
router.get(`${path}/stock/:nameSucursal`, (req, res) => {
  const { nameSucursal } = req.params;

  sucursalSchema.findOne({ nameSucursal })
    .populate('productos')
    .then((sucursal) => {
      if (!sucursal) {
        return res.status(404).json({
          error: 'La sucursal no existe.',
        });
      }

      const productos = sucursal.productos;

      if (productos.length === 0) {
        return res.status(200).json({
          message: 'No hay productos disponibles en esta sucursal.',
          productos: [],
        });
      }

      const productPromises = productos.map((productoId) => {
        return productoSchema.findById(productoId)
          .then((producto) => {
            if (!producto) {
              return null;
            }
            return {
              id: producto._id,
              name: producto.refProducto,
              stock: producto.stock,
            };
          });
      });

      return Promise.all(productPromises)
        .then((productosDetallados) => {
          const productosFiltrados = productosDetallados.filter(Boolean);
          const productoConMasStock = productosFiltrados.reduce((max, producto) => {
            return producto.stock > max.stock ? producto : max;
          }, productosFiltrados[0]);

          const respuesta = {
            sucursal: nameSucursal,
            productoConMasStock: {
              id: productoConMasStock.id,
              name: productoConMasStock.name,
              stock: productoConMasStock.stock,
            },
            productos: productosFiltrados,
          };

          return res.status(200).json(respuesta);
        });
    })
    .catch((error) => res.status(500).json({
      error: 'Error al obtener los productos de la sucursal.',
      details: error.message,
    }));
});

module.exports = router;
