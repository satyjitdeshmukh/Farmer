import mongoose from 'mongoose';

const mongodbURI = 'mongodb://localhost:27017/farmerdatabase';

const mongodbConnection = await mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        return mongoose;
    })
    .catch((err) => {
        console.error('Unable to connect to MongoDB:', err);
    });

export default mongodbConnection;
