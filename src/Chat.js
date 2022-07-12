class Chat{
    constructor(database, table){
        this.database = database;
        this.table = table;
    }

    async save(mensaje){
        try{
            await this.database(this.table).insert(mensaje);
            return true;
        }
        
        catch(err){
            console.log("Error guardando chat. Code: ", err);
            return false;
        }
    }

    async getAll(){
        try{
            const mensajes = await this.database.from(this.table).select("*")
            return mensajes;
        } catch(err){
            if (err.errno === 1) {
                /* if no table */
                const createTable = require("./db/chat/create_chat_table")
                await createTable();
                console.log(`Tabla ${this.table} creada`)
                return []
            } else {
                console.log("Error buscando mensajes. Code: ", err)
                return {error: "error buscando mensajes"}
            }
        }
    }
}

module.exports = Chat;