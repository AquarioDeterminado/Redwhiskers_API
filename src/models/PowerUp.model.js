function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PowerUpSchema = new Schema({
        powerupid: {type: Number, required: true},
        name: {type: String, required: true},
        description: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
    });
    const PowerUp = mongoose.models.PowerUp || mongoose.model('PowerUp', PowerUpSchema);
    return PowerUp;
}

module.exports = {makeModel}