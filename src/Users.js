const mongoose = require("mongoose")
const mongoConnection = require("./db/database").mongoConnection

mongoose.connect(mongoConnection).then(()=>console.log("USERS - Conexión establecida con Mongo")).catch(error=>console.log("error: ", error));


class Users{
    constructor(collectionName, schema){
        this.collection = mongoose.model(collectionName, new mongoose.Schema(schema, {timestamps: true}));
    }

    async save(user){
        const objetoModel = new this.collection(user);

        try{
            const res = await objetoModel.save();
            return res;
        }
        
        catch(err){
            console.log("Error guardando user. Code: ", err);
            return false;
        }
    }

    async getByEmail(email) {
        try {
            const object = await this.collection.findOne({ email: email }, { __v: 0 });
            
            if (object) {
                return object
            } else {
                return { error: `User de email ${email} no encontrado` }
            }
        } catch (err) {
            console.log("Error buscando email. Code: ", err)
            return {error: "error buscando email"}
        }
    }

    async getByUsername(username) {
        try {
            const object = await this.collection.findOne({ username: username }, { __v: 0 });
            
            if (object) {
                return object
            } else {
                return { error: `Username ${username} no encontrado` }
            }
        } catch (err) {
            console.log("Error buscando user. Code: ", err)
            return {error: "error buscando user"}
        }
    }
}

module.exports = Users;