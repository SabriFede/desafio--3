// Importacion

const ProductManager = require ("./product-manager");
const express = require("express");
const PUERTO = 8080;

const manager = new ProductManager("./src/productos.json");

// creamos el servidor

const app = express();

app.get("/products", async(req, res) => {
    try {
        // cargo el array de productos
        const arrayProductos = await manager.leerArchivo();

        //guardo el query

        let limit = parseInt(req.query.limit);

        if(limit) {
            const arrayConLimite = arrayProductos.slice(0, limit);
            return res.send(arrayConLimite);
        } else {
            return res.send (arrayProductos);
        }

    } catch (error) {
        console.log(error);
        return res.send("Error al procesar la solicitud")
    }
})


// ruta "/products/:pid" la cual debe recibir por req.params el pid y devolver solo el prod solicitado

app.get("/products/:pid", async (req, res) => {
    try {
        //me guardo el param
        let pid = parseInt (req.params.pid);

        //Lo busco
        const buscado = await manager.getProductById(pid);
        if (buscado) {
            return res.send (buscado)
        } else {
            return res.send ("ID de producto incorrecto")
        }

    } catch (error) {
        console.log (error);
        res.send("Error en la busqueda");
    }
})


app.listen (PUERTO, () => {
    console.log("Escuchando en el puerto 8080");
})

