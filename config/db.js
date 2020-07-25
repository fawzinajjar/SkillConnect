const mongoose = require('mongoose'); // Import Mangoose Model //
const config = require('config'); // Import Config Folder //
const db = config.get('mongoURI'); // Assign the Mongodb URI Path And Access Account //

// Establishing Connection function With Mongodb DataBase And pathing the 'URI' // 
// Declaring async function Inside ConnectDB function //
// Used Try/Catch to handle eroors and wait to db to be connected //

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser:true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}


module.exports = connectDB; // exported the module connectDB //