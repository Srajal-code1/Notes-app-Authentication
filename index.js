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

    // json web tokens (JWT)
    const token = jwt.sign({
        username: username,
    }, "srajal123");

    res.json({
        token: token
    })

})



// POST - Create a note -- AUTHENTICATED ENDPOINT
app.post("/notes", function(req, res) {
    //check if they ahve sent the right headers. extract who this user is from the header
    const token = req.headers.token;

    if(!token) {
        res.status(403).send({
            msg: "You are not logged in"
        })
        return;
    }

    const decoded = jwt.verify(token, "srajal123");
    const username = decoded.username

    if(!username) {
        res.status(403).json({
            msg: "malformed token"
        })
        return;
    }

    const note = req.body.note;
    notes.push({note, username});
    res.json({
        msg: "Done!"
    })
})

// GET - get all my notes -- AUTHENTICATED ENDPOINT
app.get("/notes", function(req, res) {
    const token = req.headers.token;

    if(!token) {
        res.status(403).send({
            msg: "You are not logged in"
        })
        return;
    }

    const decoded = jwt.verify(token, "srajal123");
    const username = decoded.username

    if(!username) {
        res.status(403).json({
            msg: "malformed token"
        })
        return;
    }
    
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