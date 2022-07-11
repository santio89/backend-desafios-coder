
const database = require('./database')

const createProductsTable = async () => {
    try{
        await database.schema.createTable("products", productTable=>{
            productTable.increments("id")-primary();
            productTable.string("title", 50).notNullable();
            productTable.string("imgUrl", 50).notNullable();
            carTable.integer('price').notNullable();
        })
    } catch(err){
        console.log("error: ", err);
        database.destroy();
    }
        
}

module.exports = createProductsTable;