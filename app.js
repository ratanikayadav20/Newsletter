const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const http = require("http");
const { Http2ServerRequest } = require("http2");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "http://us9.api.mailchimp.com/3.0.lists/b5b29d74ea";
  const options = {
    method: "POST",
    auth: "ratanika:125e2117f504a5aa5437809d988045c6-us9",
  };
  const request = http.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
// api key
// 125e2117f504a5aa5437809d988045c6-us9

// list-Id
// b5b29d74ea
