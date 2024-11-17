function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PassChangeRequestSchema = new Schema({
        passchangerequestid: {type: Number, required: true},
        userId: {type: Schema.Types.ObjectId, required: true},
        newPass: {type: Schema.Types.Mixed, required: true},
        creationDate: {type: Date, default: Date.now},
        verified: {type: Boolean, default: false},
    });
    const PassChangeRequest = mongoose.models.PassChangeRequest || mongoose.model('PassChangeRequest', PassChangeRequestSchema);
    return PassChangeRequest;
}

module.exports = {makeModel}