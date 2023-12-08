    const mongoose = require("mongoose");
let conn = null;
module.exports = connectDatabase = async() =>{
    if (conn== null){
        console.log("Create new connection database !!!");
        conn = await mongoose.connect(process.env.DB,{
            serverSelectionTimeoutMS : 5000,
        });
        return conn;
    }
    console.log("Connection already established, reusing the connection")


}