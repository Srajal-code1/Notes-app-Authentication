const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
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

    // json web tokens (JWT)
    const token = jwt.sign({
        username: username,
    }, "srajal123");

    res.json({
        token: token
    })

})



// POST - Create a note -- AUTHENTICATED ENDPOINT
app.post("/notes", authMiddleware, function(req, res) {

    const username = req.username;
    const note = req.body.note;
    notes.push({note, username});
    res.json({
        msg: "Done!"
    })
})

// GET - get all my notes -- AUTHENTICATED ENDPOINT
app.get("/notes", authMiddleware, function(req, res) {
    
    const username = req.username;
    const userNotes = notes.filter(note => note.username === username);

    res.json({
        notes: userNotes
    })
})

app.get("/", function (req, res) {
    res.sendFile("D:/100xSchool/Projects/week_09_Aunthentication/Note_app/Frontend/index.html");
})

app.get("/signup", function (req, res) {
    res.sendFile("D:/100xSchool/Projects/week_09_Aunthentication/Note_app/Frontend/signup.html");
})

app.get("/signin", function (req, res) {
    res.sendFile("D:/100xSchool/Projects/week_09_Aunthentication/Note_app/Frontend/signin.html");
})
app.listen(3000);