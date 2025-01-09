function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const BotSchema = new Schema({
        Botid: {type: Number, required: true},
        Botname: {type: String, required: true},
        type: {type: Number, required: true},
        panda: {type: Array, default: []},
        scores: {type: Array, default: []},
        powerUpStats: {type: Array, default: []},
        token: {type: String, required: true},
        DateTime: {type: Date, default: Date.now},
    });
    const Bot = mongoose.models.Bot || mongoose.model('Bot', BotSchema);
    return Bot;
}

module.exports = {makeModel}