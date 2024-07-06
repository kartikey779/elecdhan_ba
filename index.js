var express = require("express");
var app = express();
var cors = require("cors");
var login = require("./routes/login");
var form = require("./routes/formApi");
const PORT = process.env.PORT;

app.use(cors()); // Call cors as a function
app.use(express.json());
app.use("/form", form);
app.use("/login", login);

app.get("/", (req, res) => {
    res.send("App is working");
});

var server = app.listen(PORT, () => {
    console.log("Server is running on port", server.address().port);
});
