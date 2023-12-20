
const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    // Metodos:

    async addProduct(nuevoObjeto) {
        let { title, description, price, image, code, stock } = nuevoObjeto;

        if (!title || !description || !price || !image || !code || !stock) {
            console.log("Todos los datos son obligatorios, por favor completar todos los campos")
            return;
        }


        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            image,
            code,
            stock
        }

        this.products.push(newProduct);


        // guardamos el array en el archivo
        await this.guardarArchivo(this.products);

    }

    getProducts() {
        console.log(this.products);
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado exitosamente");
                return buscado;
            }

        } catch (error) {
            console.log("Error al leer el archivo", error)
        }

    }


    //Nuevos metodos desafio 2:

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer un archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));

        } catch (error) {
            console.log("Error al guardar el archivo", error)
        }
    }

    // actualizo un producto
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                // puedo usar el metodo de array splice para reemplazar el objeto en la posicion del index
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("No se encontro el producto");

            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("Producto eliminado");

            }

        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }



}

module.exports = ProductManager

