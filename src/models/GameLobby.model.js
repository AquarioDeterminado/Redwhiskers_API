function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const GameLobbySchema = new Schema({
        GameLobbyid: {type: Number, required: true},
        ListUserIdLobby: {type: Array, required: true},
        CodeId : {type: String},
        GameWasStarted: {type: Boolean, required: true},
        LobbyActive: {type: Boolean, required: true},
        // 0 - TODOS podem entrar, 1- só com CodeId entram, 2- pode entrar com o CodeId mas só se o hoster aceitar, 3 - Ninguém entra, 4 - Singleplayer
        TypeOfLobby: {type: Number, required: true},
        LobbyCreated: {type: Date, required: true},
    });
    const GameLobby = mongoose.models.GameLobby || mongoose.model('GameLobby', GameLobbySchema);
    return GameLobby;
}

module.exports = {makeModel}