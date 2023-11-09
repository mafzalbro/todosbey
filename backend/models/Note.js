const {Schema, default: mongoose} = require('mongoose')


const NotesSchema = new Schema ({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag:{
        type: Array,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    }
  });

module.exports = mongoose.model('notes', NotesSchema)