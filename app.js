const http = require("http");
const path = require("path");
const express = require("express");
const fs = require("fs");
const xmlParse = require("xslt-processor").xmlParse;
const xsltProcess = require("xslt-processor").xsltProcess;
const xml2js = require('xml2js');
const sanitizer = require("sanitize-html");
const {
    stringify
} = require("querystring");
const session = require("express-session");


router = express();
const server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({
    extended: true
})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client
// session to ensure that user is logged in or not
// user details can also be stored
router.use(session({
    secret: "irfanmalik",
    resave: false,
    saveUninitialized: true
}));

// login page is rendered on this GET request
router.get("/", (req, res) => {
    res.render("index");
});

// home page is opened on ths reuqest, only if user has logged in
router.get("/home", (req, res) => {
    if (req.session.isLoggedIn) {
        res.writeHead(301, {
            Location: 'home.html'
        });
        res.end();
    } else {
        // if user has not logged in, then go back to login page
        res.render("index");
    }
});

// flag of session (login flag) is set to false on logout and redirection is done to login page 
router.get("/logout", (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect("/");
});

// Login POST request
router.post("/login", (req, res) => {

    // input validation at server side
    if (!(req.body.username == "" || req.body.password == "")) {
        xmlFileToJs("loginCredentials.xml", function (err, result) {
            if (err) throw (err);

            // santization of input at server side
            const username = sanitizer(req.body.username);
            const password = sanitizer(req.body.password);

            // loop through all the user crednetials and checking 
            const numberOfUsers = result.users.credentials.length;
            for (var i = 0; i < numberOfUsers; i++) {
                if (result.users.credentials[i].username == username && result.users.credentials[i].password == password) {
                    req.session.isLoggedIn = true;
                    res.end("1");
                }
            }
            res.end("0");
        });
    } else {
        res.end("0");
    }
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

// POST request to add a new product
router.post("/add-product", (req, res) => {

    // input validation at server side
    if (!(req.body.id == "" || req.body.name == "" || req.body.description == "" || req.body.price == "")) {
        xmlFileToJs("mobileAccessories.xml", function (err, result) {
            if (err) throw (err);

            // santization of input at server side
            const id = sanitizer(req.body.id);
            const name = sanitizer(req.body.name);
            const description = sanitizer(req.body.description);
            const price = sanitizer(req.body.price);

            // pushing the new details of product
            result.accessories.product.push({
                "id": id,
                "name": name,
                "description": description,
                "price": price
            });
            jsToXmlFile('mobileAccessories.xml', result, function (err) {
                if (err) console.log(err);
            });
        });
        res.end("1");
    } else {
        res.end("0");
    }
});

// POST request to delete a product
router.post("/delete-product", (req, res) => {
    var deleteFlag = true;
    if (!(req.body.index == "")) {
        xmlFileToJs("mobileAccessories.xml", function (err, result) {
            if (err) throw (err);

            // santization of input at server side
            const index = sanitizer(req.body.index);
            // if it is the last product then don't delete it and show user error message
            // as all the products should not be deleted. Atleast 1 product should be kept in the system
            if (result.accessories.product.length == 1) {
                deleteFlag = false;
            } else {
                delete result.accessories.product[index - 1];

                jsToXmlFile('mobileAccessories.xml', result, function (err) {
                    if (err) console.log(err);
                });
            }
        });
        setTimeout(() => {
            if (deleteFlag) {
                console.log("ok")
                res.end("1");
            } else {
                console.log("no")
                res.end("-1");
            }
        }, 500);
    } else {
        res.end("0");
    }
});

// request to get products by index number (for update)
router.post("/get-product-by-id", (req, res) => {
    var resultObj = null;
    xmlFileToJs("mobileAccessories.xml", function (err, result) {
        if (err) throw (err);
        // santization of input at server side
        const id = sanitizer(req.body.id);
        resultObj = result.accessories.product[id - 1];
    });

    setTimeout(() => {
        res.json(resultObj);
    }, 500);
});

router.post("/update-product", (req, res) => {

    if (!(req.body.index == "" || req.body.id == "" || req.body.name == "" || req.body.description == "" || req.body.price == "")) {
        xmlFileToJs("mobileAccessories.xml", function (err, result) {
            if (err) throw (err);

            // santization of input at server side
            const index = sanitizer(req.body.index);
            const id = sanitizer(req.body.id);
            const name = sanitizer(req.body.name);
            const description = sanitizer(req.body.description);
            const price = sanitizer(req.body.price);

            // getting the updated product by index and changing the details
            result.accessories.product[index - 1].id = id;
            result.accessories.product[index - 1].name = name;
            result.accessories.product[index - 1].description = description;
            result.accessories.product[index - 1].price = price;

            // saving the updated records
            jsToXmlFile('mobileAccessories.xml', result, function (err) {
                if (err) console.log(err);
            });
        });
        res.end("1");
    } else {
        res.end("0");
    }

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