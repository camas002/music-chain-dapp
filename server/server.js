const express = require('express');
const app = express();
const cors = require('cors'); 
const PORT = 3001;
const http = require('http');

// This is to allow our api to receive data from a client app
app.use(express.urlencoded({extended: true}));

// This is to allow our api for parsing json
app.use(express.json());

// This is to allow our api for cross-origin resource sharing

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET"],
    credentials: true
}));

const server = http.createServer(function(req, res){
    res.write('it works')
    res.end()
})

server.listen(PORT, () => {
    console.log("\n*** " + `Listening at http://localhost:${PORT}` + " ***\n");
});

