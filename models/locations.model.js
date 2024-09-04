import mongoose from 'mongoose';

const locationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }, 
    latitude: {
        type: Number,
        required: true
    }
})

const locations = mongoose.model('locations', locationsSchema);

export default locations