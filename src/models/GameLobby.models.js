function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const GameLobbySchema = new Schema({
        GameLobbyid: {type: Number, required: true},
        ListUserIdLobby: {type: Array, required: true},
        CodeId : {type: String, required: true},
        GameActive: {type: Boolean, required: true},
        LobbyCreated: {type: Date, required: true},
    });
    const GameLobby = mongoose.models.GameLobby || mongoose.model('GameLobby', GameLobbySchema);
    return GameLobby;
}

module.exports = {makeModel}