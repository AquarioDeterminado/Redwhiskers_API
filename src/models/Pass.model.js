function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PassSchema = new Schema({
        passid: {type: Number, required: true},
        userid: {type: Number, required: true},
        pass: {type: String, required: true},
        salt: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
        used: {type: Boolean, default: false},
        tokens: {type: Array, default: [], schema: {token: String, created: Date, active: Boolean}},
    });
    const Pass = mongoose.models.Pass || mongoose.model('Pass', PassSchema);
    return Pass;
}

module.exports = {makeModel}