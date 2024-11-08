const {startDB} = require("./configs/DB.conf");
require('dotenv').config()
const app = (require('express'))();

startDB().then(() => {
    console.log('DB started');
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});