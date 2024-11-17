function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PassSchema = new Schema({
        passid: {type: Number, required: true},
        userId: {type: Schema.Types.ObjectId, required: true},
        pass: {type: String, required: true},
        salt: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
        used: {type: Boolean, default: false},
        tokens: {type: Array, default: [], schema: {token: String, creationDate: Date}},
    });
    const Pass = mongoose.models.Pass || mongoose.model('Pass', PassSchema);
    return Pass;
}

module.exports = {makeModel}