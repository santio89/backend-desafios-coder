
const database = require('../database').sqliteConnection

const createChatTable = async () => {
    try{
        await database.schema.createTable("chats", chatTable=>{
            chatTable.increments("id").primary();
            chatTable.string("nombre", 100).notNullable();
            chatTable.string("mensaje", 500).notNullable();
            chatTable.string('fecha', 200).notNullable();
        })
        console.log("chat table created")
    } catch(err){
        console.log("error: ", err);
    }
}

module.exports = createChatTable;