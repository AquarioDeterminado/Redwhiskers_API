User = require('../User.model.js');
Pass = require('../Pass.model.js');
PowerUp = require('../PowerUp.model.js');
Cosmetic = require('../Cosmetic.model.js');
EmailChangeRequest = require('../EmailChangeRequest.model.js');
PassChangeRequest = require('../PassChangeRequest.model.js');
Lobby = require('../Lobby.model')

async function makeModels() {
    return {
        Pass: Pass.makeModel(),
        PowerUp: PowerUp.makeModel(),
        Cosmetic: Cosmetic.makeModel(),
        EmailChangeRequest: EmailChangeRequest.makeModel(),
        PassChangeRequest: PassChangeRequest.makeModel(),
        User: User.makeModel(),
        Lobby: Lobby.makeModel(),
    };
}

module.exports = {makeModels}