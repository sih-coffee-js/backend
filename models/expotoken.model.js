import mongoose from 'mongoose';

const expoTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const expoToken = mongoose.model('ExpoToken', expoTokenSchema);

export default expoToken