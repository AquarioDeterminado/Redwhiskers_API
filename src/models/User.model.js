function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        username: {type: String, required: true},
        email: {type: String, required: true},
        inventory: {type: Array, default: [], schema: {cosmeticId: Schema.Types.ObjectId}},
        panda: {type: Object, default: [], schema: {headCosmeticId: Schema.Types.ObjectId, bodyCosmeticId: Schema.Types.ObjectId, legsCosmeticId: Schema.Types.ObjectId}},
        scores: {type: Array, default: [], schema: {score: Number, date: Date}},
        powerUpStats: {type: Array, default: [], schema: {powerUpId: Schema.Types.ObjectId, powerUpLevel: Number}},
        questProgress: {type: Array, default: []}, schema: new Schema({questId: Schema.Types.ObjectId, progress: Number}),
    });
    const User = mongoose.model('User', UserSchema);
    return User;
}

module.exports = {makeModel}