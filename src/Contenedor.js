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
            return {error: "Error guardando producto"}
        }
    }

    async saveById(id, objeto) {
        try {
            const rid = await database.from(this.table).where('id', '=', id).update(objeto)
            if (rid === 0) {
                return { error: `Producto de ID ${id} no encontrado` }
            } else {
                return { success: `Producto de ID ${id} actualizado` }
            }
        } catch (err) {
            console.log("Error guardando producto por ID. Code: ", err)
            return {error: "error guardando producto"}
        }
    }

    async getById(id) {
        try {
            const product = await database.from(this.table).where({id})
            
            if (product[0]) {
                return product[0]
            } else {
                return { error: `Producto de ID ${id} no encontrado` }
            }
        } catch (err) {
            console.log("Error buscando producto. Code: ", err)
            return {error: "error buscando producto"}
        }
    }

    async getAll() {
        try {
            const productos = await database.from(this.table).select("*")
            return productos;
        } catch (err) {
            /* if no table */
            if (err.errno === 1146) {
                await createTable();
                console.log(`Tabla ${this.table} creada`)
                return []
            } else{
                console.log("Error buscando productos. Code: ", err)
                return {error: "error buscando producto"}
            }
        }
    }

    async deleteById(id) {
        try {
            const rid = await database(this.table).where({id}).del()
            if (rid === 0) {
                return { error: `Producto de ID ${id} no encontrado` }
            } else {
                return { success: `Producto de ID ${id} eliminado` }
            }
        } catch (err) {
            console.log("Error eliminando producto por ID. Code: ", err)
            return { error: `Error eliminando producto` }
        }
    }
}
module.exports = Contenedor;