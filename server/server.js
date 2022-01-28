const express = require('express');
const app = express();
const cors = require('cors'); 
const multer = require('multer')
const PORT = 3001;
// const http = require('http');

// This is to allow our api to receive data from a client app
app.use(express.urlencoded({extended: true}));

// This is to allow our api for parsing json
app.use(express.json());

// This is to allow our api for cross-origin resource sharing

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET, POST"],
    credentials: true
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
  })
  
var upload = multer({ storage: storage }).array('file')
console.log(upload)

app.get('/',function(req,res){
    return res.send('Hello Server')
})


app.listen(PORT, () => {
    console.log("\n*** " + `Listening at http://localhost:${PORT}` + " ***\n");
});

