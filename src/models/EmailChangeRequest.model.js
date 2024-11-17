function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const EmailChangeRequestSchema = new Schema({
        EmailChangeRequestid: {type: Number, required: true},
        userId: {type: String, required: true},
        newEmail: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
        verified: {type: Boolean, default: false},
    });
    const EmailChangeRequest = mongoose.models.EmailChangeRequest || mongoose.model('EmailChangeRequest', EmailChangeRequestSchema);
    return EmailChangeRequest;
}

module.exports = {makeModel}