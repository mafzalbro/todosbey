const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/my-notes';

const connectMongoDB = async () => {
   
        await mongoose.connect(mongoURI)
        console.log('Connected Successfully');
        
        // const Cat = mongoose.model('Cat', { name: String });
        
        // const kitty = new Cat({ name: 'Zildjian' });
        // kitty.save().then(() => console.log('meow'));       
}
    module.exports = connectMongoDB