const mongoose = require("mongoose")


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
            logger.error("Error guardando user. Code: ", err);
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
            logger.error("Error buscando email. Code: ", err)
            return {error: "error buscando email"}
        }
    }

    async getById(id) {
        try {
            const object = await this.collection.findById(id)
            
            if (object) {
                return object
            } else {
                return { error: `ID ${id} no encontrado` }
            }
        } catch (err) {
            logger.error("Error buscando id. Code: ", err)
            return {error: "error buscando id"}
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
            logger.error("Error buscando user. Code: ", err)
            return {error: "error buscando user"}
        }
    }
}

module.exports = Users;