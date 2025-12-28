const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;




app.listen(PORT, () => {
    console.log(`Server listening successfully on port ${PORT}`);
})