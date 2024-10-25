const {startDB} = require("./configs/DB.conf");
require('dotenv').config()

startDB().then(() => {
    console.log('DB started');
});
