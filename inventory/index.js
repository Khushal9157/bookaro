const express = require("express");
const cookieParser = require("cookie-parser");

const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", inventoryRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
});