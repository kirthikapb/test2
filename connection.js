const mongoose = require('mongoose');

exports.connect = () => {
    try{
        mongoose.connect('mongodb+srv://kirthika:kirthi@cluster0.mxi84.mongodb.net/integra?retryWrites=true&w=majority', {useNewUrlParser : true, useUnifiedTopology:true})
        console.log("connected")
    } catch(err) {
        console.log(err);
        process.exit();
    }
}