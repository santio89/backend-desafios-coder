const logger = require("../logs/logger")

class Contenedor {
    constructor(database, table) {
        this.database = database
        this.table = table
    }

    async save(objeto) {
        try {
            const id = await this.database(this.table).insert(objeto)
            objeto.id = id[0];
            logger.info("Producto cargado con ID", objeto.id);
            
            return objeto;
        } catch (err) {
            logger.error("Error guardando producto: ", err)
            return {error: "Error guardando producto"}
        }
    }

    async saveById(id, objeto) {
        try {
            const rid = await this.database.from(this.table).where('id', '=', id).update(objeto)
            if (rid === 0) {
                return { error: `Producto de ID ${id} no encontrado` }
            } else {
                return { success: `Producto de ID ${id} actualizado` }
            }
        } catch (err) {
            logger.error("Error guardando producto por ID. Code: ", err)
            return {error: "error guardando producto"}
        }
    }

    async getById(id) {
        try {
            const product = await this.database.from(this.table).where({id})
            
            if (product[0]) {
                return product[0]
            } else {
                return { error: `Producto de ID ${id} no encontrado` }
            }
        } catch (err) {
            logger.error("Error buscando producto. Code: ", err)
            return {error: "error buscando producto"}
        }
    }

    async getAll() {
        try {
            const productos = await this.database.from(this.table).select("*")
            return productos;
        } catch (err) {
            if (err.errno === 1146) {
                /* if no table */
                const createTable = require("../db/productsSql/create_products_table")
                await createTable();
                logger.info(`Tabla ${this.table} creada`)
                return []
            } else{
                logger.error("Error buscando productos. Code: ", err)
                return {error: "error buscando producto"}
            }
        }
    }

    async deleteById(id) {
        try {
            const rid = await this.database(this.table).where({id}).del()
            if (rid === 0) {
                return { error: `Producto de ID ${id} no encontrado` }
            } else {
                return { success: `Producto de ID ${id} eliminado` }
            }
        } catch (err) {
            logger.error("Error eliminando producto por ID. Code: ", err)
            return { error: `Error eliminando producto` }
        }
    }
}
module.exports = Contenedor;