// function makeModel() {
//     const mongoose = require('mongoose');
//     const Schema = mongoose.Schema;
//     const UserSchema = new Schema({
//         userid: {type: Number, required: true},
//         username: {type: String, required: true},
//         email: {type: String, required: true},
//         inventory: {type: Array, default: [], schema: {cosmeticId: Schema.Types.ObjectId}},
//         panda: {type: Array, default: [], schema: {headCosmeticId: Schema.Types.ObjectId, bodyCosmeticId: Schema.Types.ObjectId, legsCosmeticId: Schema.Types.ObjectId}},
//         scores: {type: Array, default: [], schema: {score: Number, date: Date}},
//         powerUpStats: {type: Array, default: [], schema: {powerUpId: Schema.Types.ObjectId, powerUpLevel: Number}},
//         questProgress: {type: Array, default: []}, schema: new Schema({questId: Schema.Types.ObjectId, progress: Number}),
//     });
//     const User = mongoose.models.User || mongoose.model('User', UserSchema);
//     return User;
// }

// module.exports = {makeModel}

function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        userid: {type: Number, required: true},
        username: {type: String, required: true},
        email: {type: String, required: true},
        inventory: {type: Array, default: []},
        panda: {type: Array, default: []},
        scores: {type: Array, default: []},
        powerUpStats: {type: Array, default: []},
        questProgress: {type: Array, default: []},
    });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    return User;
}

module.exports = {makeModel}