const fs = require("fs");
const database = require("./db/products/database");
const createTable = require("./db/products/create_products_table")
class Contenedor {
    constructor(table) {
        this.table = table
    }

    async save(objeto) {
        try {
            const id = await database(this.table).insert(objeto)
            objeto.id = id[0];
            console.log("Producto cargado con ID", objeto.id);
            return objeto;
        } catch (err) {
            console.log("Error guardando producto: ", err)
        }
    }

    async saveById(id, objeto) {
        const index = this.productos.findIndex(producto => producto.id === id)
        if (index != -1) {
            objeto.id = id;
            this.productos[index] = objeto;

            try {
                await fs.promises.writeFile(this.table, JSON.stringify(this.productos));
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

    async getAll() {
        try {
            const productos = await database.from(this.table).select("*")
            return productos;
        } catch (err) {
            /* if no table */
            if (err.errno === 1146){
                createTable();
            }
        }
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
                await fs.promises.writeFile(this.table, JSON.stringify(this.productos))
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