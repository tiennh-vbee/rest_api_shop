const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/API_Shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failed!!!');
    }
}

module.exports = {connect};