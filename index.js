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
                console.log("Siii, lo encontramos!");
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

// Testing

//1) Creo la instancia de la clase "ProductManager"

const manager = new ProductManager("./productos.json");

//2) Se llamara "getProducts" recien creada la instancia, debe devolver un arreglo vacio

manager.getProducts();

//3) se llamara al metodo "addProduct" con los campos:

//manager.addProduct("Producto Prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25);

const fideos = {
    title: "fideos",
    description: "Los mas ricos",
    price: 150,
    image: "Sin imagen",
    code: "abc123",
    stock: 30
}


manager.addProduct(fideos);



//4) el objeto debe agregarse satisfactoriamente con un id generado automaticamente SIN REPETIRSE

const arroz = {
    title: "arroz",
    description: "no se pasa",
    price: 250,
    image: "Sin imagen",
    code: "abc124",
    stock: 30
}

manager.addProduct(arroz);


const aceite = {
    title: "aceite",
    description: "carissssimo",
    price: 15000,
    image: "Sin imagen",
    code: "abc125",
    stock: 30
}

manager.addProduct(aceite);



//5) se llama nuevamente al metodo "getProducts", esta vez debe aparecer el producto recien agregado

//manager.getProducts();


//6)Se llamara al metodo "getProductById" y se corroborara que devuelva el producto con el id especificado, en caso de no existir debe arrojar un error

async function testBusquedaPorId() {
    const buscado = await manager.getProductById(2);
    console.log(buscado);
}

testBusquedaPorId();

const salsa = {
    id: 1,
    title: "salsa",
    description: "de tomate",
    price: 150,
    image: "Sin imagen",
    code: "abc123",
    stock: 30
};

//testeo actualizacion producto

async function testeoActualizacion() {
    await manager.updateProduct(1, salsa);
}

testeoActualizacion(); 



// testeo eliminar un producto

async function testeoEliminacion(){
    await manager.deleteProductById(3);
}

testeoEliminacion();