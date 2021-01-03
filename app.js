const http = require("http");
const path = require("path");
const express = require("express");
const fs = require("fs");
const xmlParse = require("xslt-processor").xmlParse;
const xsltProcess = require("xslt-processor").xsltProcess;
const xml2js = require('xml2js');


router = express();
const server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({
    extended: true
})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client


router.get("/", (req, res) => {
    res.render("index");
});

router.get("/getProducts", (req, res) => {
    // setting the content type
    res.writeHead(200, {
        'Content-Type': 'text/html'
    }); 

    var xml = fs.readFileSync('mobileAccessories.xml', 'utf8'); 
    var xsl = fs.readFileSync('mobileAccessories.xsl', 'utf8'); 

    var doc = xmlParse(xml); 
    var stylesheet = xmlParse(xsl); 

    var result = xsltProcess(doc, stylesheet); 

    res.end(result.toString()); 
});


router.post("/add-product", (req, res) => {
    //
    xmlFileToJs("mobileAccessories.xml", function (err, result) {
        if (err) throw (err);
        
        result.accessories.product.push({"id":req.body.id,"name":req.body.name,"description":req.body.description,"price":req.body.price});
        jsToXmlFile('mobileAccessories.xml', result, function(err){
            if (err) console.log(err);
        });
    });
    res.end("1");
});


// [START] Reference: These functions are taken from the provided node project (iwa-main) 
// helper functions

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
}
// [END] Reference: These functions are taken from the provided node project (iwa-main) 





const host = "127.0.0.1";
const port = 3000;

server.listen(process.env.PORT || port, process.env.IP || host, function () {
    const address = server.address()
    console.log("Server listening at " + host + ":" + port);
});