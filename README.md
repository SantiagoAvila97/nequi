# Aplicación Cliente-Servidor para crear Franquicias, Sucursales y Productos en Mongo DB Atlas

Prueba practica cliente-servidor, que permite crear franquicias, sucursales asociadas a franquicias, productos asociados a sucursales, stock por producto en sucursal.

Cuenta con todas las validaciones para evitar duplicados, crear alguna sucurcusal o producto si si existe en la tabla padre, entre otras valdaciones y respuesta para experiencia del cliente.

# Instrucciones para ejecutar

1. Requisitos

- Node JS v18.20.2

2. Ejecución

- Clonar proyecto <git clone url_git>
- Ubicarse en la rama "develop" <git switch develop> desde el bash
- Instalar dependencias <npm i>
- Extraer Collection.json e importarlo en Postman
- Ejecutar <npm run serve>
- Realizar pruebas desde Postman
