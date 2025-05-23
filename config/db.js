const mongoose = require('mongoose');
module.exports.connectToMongoDb = async() => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MongDb_Url)
    .then(
        ()=> {console.log("connect to db")})
    .catch((err)=>{
        console.log(err);
    });
};