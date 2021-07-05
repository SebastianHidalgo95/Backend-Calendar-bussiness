/* 
    Esto sirve para conectarse a la base de datos

*/
    
const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify: false
        });

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al momento de iniciar la BD')
    }
}

module.exports = {
    dbConnection
}