"use strict";
// Get the file path
var fs = require("fs");
var path = require("path");
// Get express for server
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
// Get bcrypt for password encryption
var bcrypt = require("bcrypt");
// Get to MySQL for database
const mysql = require("mysql2");

// Establish Connection to database
const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "tmille39_TCTG_User",
  password: "[H0l3_in_0N3]",
  database: "tmille39_TCTG_Golf_Academy",
});

// Establish Connection to Web Browser
con.connect(function (err) {
  // Give error to Terminal if something were to happen
  if (err) throw err;
  // Show that the Connection if valid in Terminal
  console.log("Connected");
});

// Set the port to run on 3000
app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Goes to login page on start up
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/"));
});

// Show that the Connection Link Terminal and allow user to go to link
app.listen(app.get("port"), function () {
  // For backend development it will only redirect to the backend. This will be changed in the future.
  console.log(
    "Server started: http://localhost:" + app.get("port") + "/backend"
  );
});

/* === BREAK === */
/* SQL Commands Are Located In this File*/


/* === EMPLOYEES ===  */

// Insert New Employee

app.post("/newTCTGEmployee", function (req, res) {
  // Declare Variables
  var empFNameTM = req.body.employeeFNameTM;
  var empLNameTM = req.body.employeeLNameTM;
  var empEAddressTM = req.body.employeeEAddressTM;
  var empPNumberTM = req.body.employeePNumberTM;
  var empHDateTM = req.body.employeeHDateTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Employee(dbemployeefirstname, dbemployeelastname, dbemployeeemailaddress, dbemployeephonenumber, dbemployeehiredate) " +
    "VALUES(?, ?, ?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [
    empFNameTM,
    empLNameTM,
    empEAddressTM,
    empPNumberTM,
    empHDateTM,
  ];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    console.log("New Employee Added");
    res.end();
  });
});


// Select Employees

app.get("/getTCTGEmployee/", function (req, res) {
  // Declare Variables
  var empFNameTM = req.body.employeeFNameTM;
  var empLNameTM = req.body.employeeLNameTM;
  var empEAddressTM = req.body.employeeEAddressTM;
  var empPNumberTM = req.body.employeePNumberTM;
  var empHDateTM = req.body.employeeHDateTM;

  var sqlselTM =
    "Select Employee.* from Employee " +
    "where dbemployeefirstname Like ? " +
    "and dbemployeelastname Like ?" +
    "and dbemployeeemailaddress Like ? " +
    "and dbemployeephonenumber Like ? " +
    "and dbemployeehiredate Like ?";

  var insertsTM = [
    "%" + empFNameTM + "%",
    "%" + empLNameTM + "%",
    "%" + empEAddressTM + "%",
    "%" + empPNumberTM + "%",
    "%" + empHDateTM + "%",
  ];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlselTM, insertsTM);
  // console.log(sql);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

// Get Employee Names
app.get("/getEmployeeNames/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Employee";
  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

/* === END === */

/* === EMPLOYEE USER === */

// Insert a Employee User

app.post("/newEmployeeUser", function (req, res) {
  // Declare Variables
  var empFLNameTM = req.body.employeeNameTM;
  var empRoleTM = req.body.roleNameTM;
  var empUNameTM = req.body.employeeUsernameTM;
  var empPassTM = req.body.employeePasswordTM;

  // Encrypt Password
  // Adds Random Characters to password
  var saltRoundsTM = 10;
  var hashedPWTM = "";

  // Use empPassTM with saltRounds to create a hashedPWTM
  bcrypt.hash(empPassTM, saltRoundsTM, function (err, hashedPasswordTM) {
    if (err) {
      // Output if the password turns bad and stop
      console.log("Bad");
      return;
    } else {
      // Set the hashedPasswordTM to hashedPWTM
      hashedPWTM = hashedPasswordTM;

      // Prepare SQL Command for Insert => Employee User Table
      var sqlinsEmpUserTM =
        "INSERT INTO EmployeeUser(dbemployeeid, dbemployeeusername, dbemployeeuserpassword) " +
        "VALUES(?, ?, ?)";

      // Place Values Into SQL Command
      var insertsEmpUserTM = [empFLNameTM, empUNameTM, hashedPWTM];

      // Format SQL with Command and insertsTM
      var sqlEmpUserTM = mysql.format(sqlinsEmpUserTM, insertsEmpUserTM);

      // Run SQL Command
      con.execute(sqlEmpUserTM, function (err, result) {
        if (err) throw err;

        // Get New Primary Key from sqlEmpUser
        var primaryKeyTM = result.insertId;

        // Prepare SQL Command for Insert => Linking Table for Employee User and Roles
        var sqlinsEmpRoleTM =
          "INSERT INTO EmployeeUserRole(dbemployeeuserid, dbroleid) " +
          "VALUES(?, ?)";

        // Place Values Into SQL Command
        var insertsEmpRoleTM = [primaryKeyTM, empRoleTM];

        // Format SQL with Command and insertsTM
        var sqlEmpUserTM = mysql.format(sqlinsEmpRoleTM, insertsEmpRoleTM);

        // Run SQL Command
        con.execute(sqlEmpUserTM, function (err, result) {
          if (err) throw err;
          console.log("New Employee User Added");
          res.end();
        });
      });
    }
  });
});

/* === END === */

/* === PLAYERS (CUSTOMERS) === */

// Insert New Player

app.post("/newPlayer", function (req, res) {
  // Declare Variables
  var playFNameTM = req.body.playerFNameTM;
  var playLNameTM = req.body.playerLNameTM;
  var playEAddressTM = req.body.playerEAddressTM;
  var playPNumberTM = req.body.playerPNumberTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Customer(dbcustomerfirstname, dbcustomerlastname, dbcustomeremailaddress, dbcustomerphonenumber) " +
    "VALUES(?, ?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [playFNameTM, playLNameTM, playEAddressTM, playPNumberTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("New Player Added");
    res.end();
  });
});

// Get Player Names
app.get("/getPlayerNames/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Customer";
  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

/* === END === */

/* === RESERVATIONS === */

// Insert New Reservation

app.post("/newReservation", function (req, res) {
  // Declare Variables
  var playFLNameTM = req.body.playerNameTM;
  var reservationDTTM = req.body.reservationDateTimeTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Reservation(dbcustomerid, dbreservationdatetime) " +
    "VALUES(?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [playFLNameTM, reservationDTTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("New Reservation Added");
    res.end();
  });
});

/* === END === */

/* === PRODUCTS === */

// Insert New Product

app.post("/newProduct", function (req, res) {
  // Declare Variables
  var prodNameTM = req.body.productNameTM;
  var prodDescriptionTM = req.body.productDescriptionTM;
  var prodPriceTM = req.body.productPriceTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Product(dbproductname, dbproductdescription, dbproductprice) " +
    "VALUES(?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [prodNameTM, prodDescriptionTM, prodPriceTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    console.log("New Product Added");
    res.end();
  });
});

// Get Product Names
app.get("/getProductNames/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Product";
  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

/* === END === */

/* === INVENTORY === */

// Insert New Inventory

app.post("/newInventory", function (req, res) {
  // Declare Variables
  var prodIdTM = req.body.productNameTM;
  var invQuantityTM = req.body.inventoryQuantityTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Inventory(dbproductid, dbinventorystocknumber) " +
    "VALUES(?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [prodIdTM, invQuantityTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    console.log("New Inventory Added");
    res.end();
  });
});

/* === END === */

/* === Purchase === */

// Insert New Purchase

app.post("/newPurchase", function (req, res) {
  // Declare Variables
  var playFLNameTM = req.body.playerNameTM;
  var empFLNameTM = req.body.employeeNameTM;
  var purchaseDTTM = req.body.purchaseDateTimeTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Purchase(dbcustomerid, dbemployeeid, dbpurchasedatetime) " +
    "VALUES(?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [playFLNameTM, empFLNameTM, purchaseDTTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("New Purchase Added");
    res.end();
  });
});

/* === END === */

/* === ROLES === */

// Get Role Names
app.get("/getRoleNames/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Role";
  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

/* === END === */
