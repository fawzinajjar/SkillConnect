const mongoose = require('mongoose'); // Import Mangoose Model //
const config = require('config'); // Import Config Folder //
const db = config.get('mongoURI'); // Assign the Mongodb URI Path And Access Account //


// we exported the async function connectDB that will use mongoose package to connect 
// to databsae with the connect() method , we use dtry catch to  handle if there an error and we used await 
// that belongs to asyn function to pass a promise and return connection
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
};


module.exports = connectDB; // exported the module connectDB //