function makeModel() {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const PowerUpSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
    });
    const PowerUp = mongoose.model('PowerUp', PowerUpSchema);
    return PowerUp;
}

module.exports = {makeModel}