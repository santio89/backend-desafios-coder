class Chat {
    constructor(database, table) {
        this.database = database;
        this.table = table;
    }

    async save(mensaje) {
        try {
            await this.database(this.table).insert(mensaje);
            return true;
        }

        catch (err) {
            logger.error("Error guardando chat. Code: ", err);
            return false;
        }
    }

    async getAll() {
        try {
            const mensajes = await this.database.from(this.table).select("*")
            return mensajes;
        } catch (err) {
            if (err.errno === 1) {
                /* if no table */
                const createTable = require("./db/chat/create_chat_table")
                await createTable();
                logger.info(`Tabla ${this.table} creada`)
                return []
            } else {
                logger.error("Error buscando mensajes. Code: ", err)
                return { error: "error buscando mensajes" }
            }
        }
    }
}

module.exports = Chat;