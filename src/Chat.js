const fs = require("fs");

class Chat{
    constructor(archivo){
        this.mensajes = [];
        this.archivo = archivo;
    }

    async save(mensaje){
        try{
            this.mensajes.push(mensaje);
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.mensajes));
            return true;
        }
        
        catch(err){
            console.log("Error guardando objeto en el fs. Code: ", err);
        }
    }

    async getAll(){
        try{
            const mensajes = JSON.parse(await fs.promises.readFile(this.archivo, "utf-8"));
            this.mensajes = mensajes?mensajes:[]
            return this.mensajes;
        } catch(err){
            if (err.code === 'ENOENT') {
                /* si el archivo no existe, lo creo */
                await fs.promises.writeFile(this.archivo, "");
                return this.mensajes;
            } else {
                console.log("Error buscando archivos en el fs. Code: ", err);
            }
        }
    }
}

module.exports = Chat;