const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const soap = require("soap");
const mongoose = require("mongoose");
const soapService = require("./controllers/product.controller");
const dotenv = require("dotenv");
const app = express();

const privateKey = fs.readFileSync("cert/server.key", "utf8");
const certificate = fs.readFileSync("cert/server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };
dotenv.config();
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  basicAuth({
    users: { admin: "password" },
    challenge: true,
  })
);

app.use(bodyParser.raw({ type: () => true, limit: "5mb" }));

const wsdl = fs.readFileSync("wsdl/product.wsdl", "utf8");

const soapServiceDefinition = soapService.getServiceDefinition();
const soapServiceObject = soapService.getServiceObject();

soap.listen(app, "/soap", soapServiceObject, wsdl);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT, () => {
  console.log(`SOAP API running at https://localhost:${process.env.PORT}/soap`);
});
