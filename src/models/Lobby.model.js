function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PassSchema = new Schema({
        isActive: {type: Boolean},
        inviteCode: {type: String, required: true},
        users: {type: Array, default: [],  schema: {user: Schema.Types.ObjectId}},
        creationDate: {type: Date, default: Date.now},
        gameState: {type: Array, default: []},
    });
    const Pass = mongoose.model('Lobby', PassSchema);
    return Pass;
}

module.exports = {makeModel}