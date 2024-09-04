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
    type:{
        type: String,
        required: true,
        default: 'CheckIn',
        enum:['CheckIn','CheckOut']
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const trackRecord = mongoose.model('trackRecord', trackRecordSchema);

export default trackRecord