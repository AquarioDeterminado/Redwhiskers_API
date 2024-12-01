function makeModel() {
const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const CosmeticSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        creationDate: {type: Date, default: Date.now},
        image: {type: String, required: true},
        category: {type: String, required: true},
    });
    const Cosmetic = mongoose.model('Cosmetic', CosmeticSchema);
    return Cosmetic;
}

module.exports = {makeModel}