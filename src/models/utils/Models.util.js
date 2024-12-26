User = require('../../models/User.model.js');
Pass = require('../../models/Pass.model.js');
PowerUp = require('../../models/PowerUp.model.js');
Cosmetic = require('../../models/Cosmetic.model.js');
EmailChangeRequest = require('../../models/EmailChangeRequest.model.js');
PassChangeRequest = require('../../models/PassChangeRequest.model.js');
GameLobby = require('../../models/GameLobby.model.js');

async function makeModels() {
    return {
        Pass: Pass.makeModel(),
        PowerUp: PowerUp.makeModel(),
        Cosmetic: Cosmetic.makeModel(),
        EmailChangeRequest: EmailChangeRequest.makeModel(),
        PassChangeRequest: PassChangeRequest.makeModel(),
        User: User.makeModel(),
        GameLobby: GameLobby.makeModel(),
    };
}

module.exports = {makeModels}