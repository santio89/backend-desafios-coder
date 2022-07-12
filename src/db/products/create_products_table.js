
const database = require('../database').mysqlConnection

const createProductsTable = async () => {
    try{
        await database.schema.createTable("products", productTable=>{
            productTable.increments("id").primary();
            productTable.string("title", 50).notNullable();
            productTable.string("imgUrl", 50).notNullable();
            productTable.integer('price').notNullable();
        })
        console.log("product table created")
    } catch(err){
        console.log("error: ", err);
    }
}

module.exports = createProductsTable;