const http = require("http");
const path = require("path");
const express = require("express");

router = express();
const server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client


router.get("/",(res,req)=>{
    res.render("index");
});


const host = "127.0.0.1";
const port = 3000;

server.listen(process.env.PORT || port, process.env.IP || host,function(){
    const address = server.address()
    console.log("Server listening at "+host+":"+port);
});



