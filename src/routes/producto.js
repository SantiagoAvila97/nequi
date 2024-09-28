const express = require("express");
const sucursalSchema = require("../models/sucursal");
const productoSchema = require("../models/producto");

const router = express.Router();
const path = "/producto";

// Crear nueva sucursal, asociada a una franquicia
router.post(`${path}/create`, (req, res) => {
  const { nameSucursal, refProducto } = req.body;

  sucursalSchema.findOne({ nameSucursal })
    .then((sucursal) => {
      if (!sucursal) {
        return sucursalSchema.find()
          .then((sucursal) => {
            const sucursalList = sucursal.map((f) => ({
              nameSucursal: f.nameSucursal,
            }));
            return res.status(400).json({
              error: 'La sucursal no existe. Estas son las sucursales disponibles:',
              availableSucursales: sucursalList,
            });
          })
          .catch((error) => res.status(500).json({ error: 'Error al obtener las sucursales', details: error.message }));
      }

      productoSchema.findOne({ refProducto })
        .then((productoExistente) => {
          if (productoExistente) {
            return res.status(400).json({
              error: 'Ya existe una producto con ese nombre',
            });
          }

          productoSchema(req.body)
            .save()
            .then((productoCreado) => {
              console.log(sucursal);

              sucursal.productos.push(productoCreado._id);
              sucursal.save()
                .then(() => res.status(201).json({
                  message: 'Producto creado y agregado a la sucursal',
                  producto: productoCreado,
                  sucursal,
                }))
                .catch((error) =>
                  res.status(500).json({
                    error: 'Error al actualizar la sucursal con el nuevo producto',
                    details: error.message,
                  })
                );
            })
            .catch((error) =>
              res.status(500).json({
                error: 'Error al guardar el producto en la base de datos',
                details: error.message,
              })
            );
        })
        .catch((error) => res.status(500).json({ error: 'Error al verificar el nombre del producto', details: error.message }));
    })
    .catch((error) => res.status(500).json({ error: 'Error al validar la sucursal', details: error.message }));
});

// Eliminar un producto y eliminar la referencia en la sucursal
router.delete(`${path}/delete/:refProducto`, (req, res) => {
  const { refProducto } = req.params;

  productoSchema.findOne({ refProducto})
    .then((producto) => {
      if (!producto) {
        return res.status(404).json({
          error: 'El producto no existe',
        });
      }

      productoSchema.findOneAndDelete({ refProducto })
        .then(() => {
          sucursalSchema.findOneAndUpdate(
            { productos: producto._id },
            { $pull: { productos: producto._id } },
            { new: true }
          )
            .then((sucursalActualizada) => {
              if (!sucursalActualizada) {
                return res.status(404).json({
                  error: 'El producto fue eliminado, pero no se encontró la sucursal asociada',
                });
              }
              return res.status(200).json({
                message: 'Producto eliminado exitosamente de la sucursal y de la base de datos',
                sucursal: sucursalActualizada,
              });
            })
            .catch((error) => res.status(500).json({ error: 'Error al actualizar la sucursal', details: error.message }));
        })
        .catch((error) => res.status(500).json({ error: 'Error al eliminar el producto', details: error.message }));
    })
    .catch((error) => res.status(500).json({ error: 'Error al verificar el producto', details: error.message }));
});

// Modificar el stock de un producto por refProduct
router.put(`${path}/update-stock`, (req, res) => {
  const { refProducto, stock } = req.body;

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({
      error: 'El stock debe ser un número válido y no puede ser negativo.',
    });
  }

  productoSchema.findOne({ refProducto })
    .then((producto) => {
      if (!producto) {
        return res.status(404).json({
          error: 'El producto no existe.',
        });
      }

      producto.stock = stock;
      producto.save()
        .then((productoActualizado) => {
          return res.status(200).json({
            message: 'Stock actualizado exitosamente.',
            producto: productoActualizado,
          });
        })
        .catch((error) => res.status(500).json({
          error: 'Error al actualizar el stock del producto.',
          details: error.message,
        }));
    })
    .catch((error) => res.status(500).json({
      error: 'Error al verificar el producto.',
      details: error.message,
    }));
});

module.exports = router;
