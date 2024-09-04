import mongoose from 'mongoose';

const trackRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locations',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const trackRecord = mongoose.model('trackRecord', trackRecordSchema);

export default trackRecord