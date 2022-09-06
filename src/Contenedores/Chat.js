const mongoose = require("mongoose")
const logger = require("../logs/logger")

class Chat{
    constructor(collectionName, schema){
        this.collection = mongoose.model(collectionName, new mongoose.Schema(schema, {timestamps: true}));
    }

    async save(mensaje){
        const objetoModel = new this.collection(mensaje);

        try{
            const res = await objetoModel.save();
            return res;
        }
        
        catch(err){
            logger.error("Error guardando chat. Code: ", err);
            return false;
        }
    }

    async getAll(){
        try{
            const mensajes = await this.collection.find({}, { __v: 0 })
            return mensajes;
        } catch(err){
            logger.error("Error guardando chat. Code: ", err);
            return false;
        }
    }
}

module.exports = Chat;