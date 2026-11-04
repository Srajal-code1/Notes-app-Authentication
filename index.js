const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const notes = [];
const users = [];

app.post("/signup", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = users.find(user => user.username === username);
    if(userExists) {
        return res.status(403).json({
            msg: "User with this username already exists"
        })
    }
    users.push({
        username: username, 
        password: password
    })
    res.json({
        msg: "You have signed up"
    })
})


app.post("/signin", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = users.find(user => user.username === username && user.password === password);

    if(!userExists) {
        res.send(403).json({
            msg: "Incorrect credentials"
        })
        return;
    }

})

// json web tokens (JWT)
const token = jwt.sign({
    username: username,
    password: password
})


// POST - Create a note
app.post("/notes", function(req, res) {

    const note = req.body.note;
    notes.push(note);
    res.json({
        msg: "Done!"
    })
})

app.get("/notes", function(req, res) {
    res.json({
        notes
    })
})

app.get("/", function (req, res) {
    res.sendFile("D:/100xSchool/Projects/week_09_Aunthentication/Note_app/Frontend/index.html");
})
app.listen(3000);