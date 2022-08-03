const mongoose = require("mongoose")
const mongoConnection = require("./db/database").mongoConnection

mongoose.connect(mongoConnection).then(()=>console.log("Conexión establecida con Mongo")).catch(error=>console.log("error: ", error));


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
            console.log("Error guardando chat. Code: ", err);
            return false;
        }
    }

    async getAll(){
        try{
            const mensajes = await this.collection.find({}, { __v: 0 })
            return mensajes;
        } catch(err){
            console.log("Error guardando chat. Code: ", err);
            return false;
        }
    }
}

module.exports = Chat;