const mongoose = require('mongoose')


const connectDb=()=>{
    mongoose.connect("mongodb+srv://zuhaib1:zuhaib1@cluster0.lgott1j.mongodb.net/carzonline")
    .then(() => {
        console.log('====================================');
        console.log(`Database connected successfully with ${mongoose.connection.host}`);
        console.log('====================================');
    })
    .catch(err => { console.log("Error connecting db", err) });

}

module.exports=connectDb