const fs = require("fs");
class Contenedor {
    constructor(archivo) {
        this.archivo = archivo
        this.productos = [];
    }

    /* init - carga productos del archivo */
    async init() {
        try {
            this.productos = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            console.log("Productos cargados");
        } catch (err) {
            if (err.code === 'ENOENT') {
                /* si el archivo no existe, lo creo */
                await fs.promises.writeFile(this.archivo, JSON.stringify([]));
                console.log("Productos cargados");
            } else {
                console.log("Error cargando productos. Code: ", err);
            }
        }
    }

    async save(objeto) {
        try {
            /* busco id en archivo */
            let ids = JSON.parse(await fs.promises.readFile("./src/productIds.txt", "utf-8"));
            ids.push(ids[ids.length - 1] + 1);
            objeto.id = ids[ids.length - 1];
            await fs.promises.writeFile("./src/productIds.txt", JSON.stringify(ids));
            this.productos.push(objeto)
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            console.log("Producto cargado");

            return objeto;
        } catch (err) {
            if (err.code === 'ENOENT') {
                /* si el archivo no existe, lo creo */
                await fs.promises.writeFile("./src/productIds.txt", JSON.stringify([1]));
                console.log("Producto cargado");
            } else {
                console.log("Error guardando objeto en el fs. Code: ", err);
            }
        }
    }

    async saveById(id, objeto) {
        const index = this.productos.findIndex(producto => producto.id === id)
        if (index != -1) {
            objeto.id = id;
            this.productos[index] = objeto;

            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos));
            } catch (err) {
                console.log("Error guardando producto por ID. Code: ", err)
            }

            return this.productos[index];
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }

    getById(id) {
        const objeto = this.productos.find(producto => producto.id === id);
        return (objeto ? objeto : { error: `No se encontró el producto con ID ${id}` });
    }

    getAll() {
        return (this.productos);
    }

    async deleteById(id) {
        const index = this.productos.findIndex(producto => producto.id === id)
        if (index != -1) {
            const removedItem = this.productos.splice(index, 1);
            const removedItems = []

            try {
                removedItems = JSON.parse(await fs.promises.readFile("./src/deletedProducts.txt", "utf-8"))
                removedItems.push(removedItem);
                await fs.promises.writeFile("./src/deletedProducts.txt", JSON.stringify([removedItems]));
                await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
            } catch (err) {
                if (err.code === 'ENOENT') {
                    await fs.promises.writeFile("./src/deletedProducts.txt.txt", JSON.stringify([removedItem]));
                } else {
                    console.log("Error eliminando por ID. Code: ", err)
                }
            }
            return { success: `Producto con ID ${id} eliminado` }
        } else {
            return { error: `No se encontró el producto con ID ${id}` }
        }
    }
}

module.exports = Contenedor;