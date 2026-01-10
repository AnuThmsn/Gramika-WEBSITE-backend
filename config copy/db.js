const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('🔗 Attempting MongoDB Atlas connection...');
    console.log('📦 Connection string present');
    
    try {
        // REMOVE the options - Mongoose 6+ doesn't need them
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Atlas Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Ready State: ${conn.connection.readyState}`);
        
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection FAILED: ${error.message}`);
        console.error(`Full error:`, error);
        
        // Try to parse the error for more details
        if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
            console.error(`🔑 AUTH ERROR: Check your MongoDB Atlas username/password`);
        }
        if (error.message.includes('ENOTFOUND')) {
            console.error(`🌐 NETWORK ERROR: Cannot reach MongoDB Atlas. Check internet connection.`);
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;