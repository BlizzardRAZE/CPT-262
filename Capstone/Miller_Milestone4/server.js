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
// Get Token and Cookie
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Create Key for project
const jwtKey = "AfOSUSyomuUj";
const jwtExpirySeconds = 3000;

// Establish Connection to database
const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "tmille39_TCTG_User",
  password: "[H0l3_in_0N3]",
  database: "tmille39_TCTG_Golf_Academy",
  dateStrings: true,
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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Goes to login page on start up
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/"));
});

// Show that the Connection Link Terminal and allow user to go to link
app.listen(app.get("port"), function () {
  // For backend development it will only redirect to the backend. This will be changed in the future.
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});

/* === BREAK === */
/* SQL Commands Are Located In this File*/

/* === LOGIN ===*/

// Login Page for User
app.post("/loginUser/", function (req, res) {
  // Declare Variables
  var userEMailTM = req.body.userEmailAddressTM;
  var uPassTM = req.body.userPasswordTM;

  // Prepare SQL Command for Select => User Table
  var sqlSelTM =
    "SELECT (dbuserid) as userId, (dbuseremailaddress) as userEmailAddress, " +
    "(dbuserpassword) as userPassword, (dbuseraccess) as userAccess, (dbroleid) as userRole " +
    "from User WHERE dbuseremailaddress = ?";

  // Place Values Into SQL Command
  var insertsTM = [userEMailTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlSelTM, insertsTM);

  // Run SQL Command for sign in for admin
  con.query(sqlTM, function (err, data) {
    // Check to see if input is undefined
    // console.log(data);
    if (data.length > 0) {
      // Check to see if user has access to backend
      if (data[0].userAccess == 1) {
        // Declare Variable for Id
        var userIdTM = data[0].userId;
        bcrypt.compare(
          uPassTM,
          data[0].userPassword,
          function (err, passwordCorrectTM) {
            if (err) {
              throw err;
            } else if (!passwordCorrectTM) {
              console.log("Password Incorrect");
            } else {
              // Prepare Token to show user
              const token = jwt.sign({ userIdTM }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
              });

              // Assign Token to cookie
              res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });

              // console.log("Password Correct");
              // Redirect User
              res.send({ redirect: "../backend/insert/insertplayer.html" });
            }
          }
        );
      } else {
        console.log("User Not Authorized!");
      }
    } else {
      console.log("Missing Email Address!");
    }
  });
});

// Function to run to check if user the role to interact with page
app.get("/getUserLoggedIn/", function (req, res) {
  // Declare Variables
  var viewPageTM = 0;
  var dataHoldTM = [];
  var payLoadTM;
  // Get token from cookie in current session
  const validToken = req.cookies.token;
  // console.log('token new:', validtoken);

  // Check to see if there is not valid token
  if (!validToken) {
    // Set Value to view page to zero to hide page
    viewPageTM = 0;
    // console.log("NVT");
  } else {
    // Otherwise, try to verify the token
    try {
      payLoadTM = jwt.verify(validToken, jwtKey);
      // console.log('payload new:', payload.empkey);
      viewPageTM = payLoadTM.userIdTM;


      // Prepare SQL Command for Insert => User Table
      var sqlSelTM = "select * from User where dbuserid = ?";
      // Place Values Into SQL Command
      var insertTM = [viewPageTM];

      // Format SQL with Command and insertsTM
      var sqlTM = mysql.format(sqlSelTM, insertTM);

      // Run SQL Command
      con.query(sqlTM, function (err, data) {
        if (err) {
          // console.error(err);
          process.exit(1);
        }
        // console.log("Show Role Num:" + data[0].dbroleid);

        // Place information to array
        dataHoldTM = data[0].dbroleid;

        res.send(JSON.stringify(data));
      });
      // Output any errors if token cannot be validated
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        viewPageTM = 0;
        // console.log("NVT2");
      }
      viewPageTM = 0;
      // console.log("NVT3");
    }
  }
});

// Function to remove user's token when logging out
app.get('/getUserLoggedOut/', function (req, res) {
  res.cookie('token', 2, { maxAge: 0 })
  res.send({ redirect: '/backend/index.html'});
});

/* END */

/* === USER === */

// Insert a User

app.post("/newUser", function (req, res) {
  // Declare Variables
  var userFNameTM = req.body.userFNameTM;
  var userLNameTM = req.body.userLNameTM;
  var userEAddressTM = req.body.userEAddressTM;
  var userPNumberTM = req.body.userPNumberTM;
  var userHDate = req.body.userHireDateTM;
  var userPasswordTM = req.body.userPasswordTM;
  var userAccessTM = req.body.userAccessTM;
  var userRoleTM = req.body.userRoleTM;

  // Encrypt Password
  // Adds Random Characters to password
  var saltRoundsTM = 12;
  var hashedPWTM = "";

  // Use userPasswordTM with saltRounds to create a hashedPWTM
  bcrypt.hash(userPasswordTM, saltRoundsTM, function (err, hashedPasswordTM) {
    if (err) {
      // Output if the password turns bad and stop
      console.log("Bad");
      return;
    } else {
      // Set the hashedPasswordTM to hashedPWTM
      hashedPWTM = hashedPasswordTM;

      // Prepare SQL Command for Insert => User Table
      var sqlinsUserTM =
        "INSERT INTO User(dbuserfirstname, dbuserlastname, dbuseremailaddress, dbuserphonenumber, dbuserhiredate, dbuserpassword, dbuseraccess, dbroleid) " +
        "VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

      // Place Values Into SQL Command
      var insertsUserTM = [
        userFNameTM,
        userLNameTM,
        userEAddressTM,
        userPNumberTM,
        userHDate,
        hashedPWTM,
        userAccessTM,
        userRoleTM,
      ];

      // Format SQL with Command and insertsTM
      var sqlUserTM = mysql.format(sqlinsUserTM, insertsUserTM);

      // Run SQL Command
      con.execute(sqlUserTM, function (err, result) {
        if (err) throw err;
        // console.log("User Added!");
        res.end();
      });
    }
  });
});


// Select Users => For viewing (searching)
// This select will be seen by users in backend
app.get("/selectUsersB/", function (req, res) {
  // Declare Variables
  var userFNameTM = req.query.userFNameTM;
  var userLNameTM = req.query.userLNameTM;
  var userEAddressTM = req.query.userEAddressTM;
  var userPNumberTM = req.query.userPNumberTM;
  var userHDate = req.query.userHireDateTM;

  // Use Select Command on Table
  var sqlselUserTM =
    "Select User.* from User " +
    "where dbuserfirstname Like ? " +
    "and dbuserlastname Like ? " +
    "and dbuseremailaddress Like ? " +
    "and dbuserphonenumber Like ? " +
    "and dbuserhiredate Like ? ";

  // Place Values Into SQL Command
  var insertsUserTM = [
    "%" + userFNameTM + "%",
    "%" + userLNameTM + "%",
    "%" + userEAddressTM + "%",
    "%" + userPNumberTM + "%",
    "%" + userHDate + "%",
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselUserTM, insertsUserTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Select Users => For viewing (searching)
// This select will be seen by users in admin
app.get("/selectUsersA/", function (req, res) {
  // Declare Variables
  var userFNameTM = req.query.userFNameTM;
  var userLNameTM = req.query.userLNameTM;
  var userEAddressTM = req.query.userEAddressTM;
  var userPNumberTM = req.query.userPNumberTM;
  var userHDateTM = req.query.userHireDateTM;
  var userAccessTM = req.query.userAccessTM;
  var userRoleTM = req.query.userRoleTM;

  // Check the value in userAccessTM
  // Based on the value run the following SQL Command and with a specified value
  if (userAccessTM == 1 || userAccessTM == 0) {
    var userAccessAddonTM = "and dbuseraccess = ? ";
    var userAccessVarTM = userAccessTM;
  } else {
    var userAccessAddonTM = "and dbuseraccess Like ? ";
    var userAccessVarTM = "%%";
  }

  // Use Select Command on Table
  var sqlselPlayTM =
    "Select User.*, " +
    "Role.dbrolename from User " +
    "inner join Role on Role.dbroleid = User.dbroleid " +
    "where dbuserfirstname Like ? " +
    "and dbuserlastname Like ? " +
    "and dbuseremailaddress Like ? " +
    "and dbuserphonenumber Like ? " +
    "and dbuserhiredate Like ? " +
    userAccessAddonTM +
    "and dbrolename Like ?";

  // Place Values Into SQL Command
  var insertsPlayTM = [
    "%" + userFNameTM + "%",
    "%" + userLNameTM + "%",
    "%" + userEAddressTM + "%",
    "%" + userPNumberTM + "%",
    "%" + userHDateTM + "%",
    userAccessVarTM,
    "%" + userRoleTM + "%",
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselPlayTM, insertsPlayTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Update User Record
app.post("/updateSingleUser", function (req, res) {
  // Declare Variables
  var userFNameTM = req.body.updateUserFNameTM;
  var userLNameTM = req.body.updateUserLNameTM;
  var userEAddressTM = req.body.updateUserEAddressTM;
  var userPNumberTM = req.body.updateUserPNumberTM;
  var userHDate = req.body.updateUserHireDateTM;
  var userAccessTM = req.body.updateUserAccessTM;
  var userRoleTM = req.body.updateUserRoleTM;
  var userIdTM = req.body.updateUseridTM;

  // Prepare SQL Command for Update => User Table
  var sqlinsTM =
    "UPDATE User SET dbuserfirstname = ?," +
    " dbuserlastname = ?," +
    " dbuseremailaddress = ?," +
    " dbuserphonenumber = ?," +
    " dbuserhiredate = ?, " +
    " dbuseraccess = ?, " +
    " dbroleid = ? " +
    " WHERE dbuserid = ?";

  // Place Values Into SQL Command
  var insertsTM = [
    userFNameTM,
    userLNameTM,
    userEAddressTM,
    userPNumberTM,
    userHDate,
    userAccessTM,
    userRoleTM,
    userIdTM,
  ];

  // Run SQL Command
  var sqlTM = mysql.format(sqlinsTM, insertsTM);
  // console.log(sql);
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("Player Updated");

    res.end();
  });
});

// Select a Single User for update
app.get("/selectSingleUser", function (req, res) {
  var useridTM = req.query.upUseridTM;

  // Select everything in table based on the id
  var sqlselTM = "select * from User where dbuserid = ?";

  // Place Values Into SQL Command
  var insertsTM = [useridTM];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM, insertsTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Get Users
app.get("/getUsers/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from User";
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

/* === PLAYERS === */

// Insert New Player

app.post("/newPlayer", function (req, res) {
  // Declare Variables
  var playFNameTM = req.body.playerFNameTM;
  var playLNameTM = req.body.playerLNameTM;
  var playEAddressTM = req.body.playerEAddressTM;
  var playPNumberTM = req.body.playerPNumberTM;
  var playPasswordTM = req.body.playerPasswordTM;
  var playRewardTM = req.body.playerRewardTM;

  // Encrypt Password
  // Adds Random Characters to password
  var saltRoundsTM = 12;
  var hashedPWTM = "";

  // Use playPasswordTM with saltRounds to create a hashedPWTM
  bcrypt.hash(playPasswordTM, saltRoundsTM, function (err, hashedPasswordTM) {
    if (err) {
      // Output if the password turns bad and stop
      console.log("Bad");
      return;
    } else {
      // Set the hashedPasswordTM to hashedPWTM
      hashedPWTM = hashedPasswordTM;

      // Prepare SQL Command for Insert => Player Table
      var sqlinsPlayTM =
        "INSERT INTO Player(dbplayerfirstname, dbplayerlastname, dbplayeremailaddress, dbplayerphonenumber, dbplayerpassword, dbrewardid) " +
        "VALUES(?, ?, ?, ?, ?, ?)";

      // Place Values Into SQL Command
      var insertsPlayTM = [
        playFNameTM,
        playLNameTM,
        playEAddressTM,
        playPNumberTM,
        hashedPWTM,
        playRewardTM,
      ];

      // Format SQL with Command and insertsTM
      var sqlPlayTM = mysql.format(sqlinsPlayTM, insertsPlayTM);

      // Run SQL Command
      con.execute(sqlPlayTM, function (err, result) {
        if (err) throw err;
        // console.log("Player Added!");
        res.end();
      });
    }
  });
});

// Select Players => For viewing (searching)
app.get("/selectPlayers/", function (req, res) {
  // Declare Variables
  var playFNameTM = req.query.playerFNameTM;
  var playLNameTM = req.query.playerLNameTM;
  var playEAddressTM = req.query.playerEAddressTM;
  var playPNumberTM = req.query.playerPNumberTM;
  var playRewardTM = req.query.playerRewardTM;

  // Use Select Command on Table
  var sqlselPlayTM =
    "Select Player.*, " +
    "Reward.dbrewardname from Player " +
    "inner join Reward on Reward.dbrewardid = Player.dbrewardid " +
    "where dbplayerfirstname Like ? " +
    "and dbplayerlastname Like ? " +
    "and dbplayeremailaddress Like ? " +
    "and dbplayerphonenumber Like ? " +
    "and dbrewardname Like ?";

  // Place Values Into SQL Command
  var insertsPlayTM = [
    "%" + playFNameTM + "%",
    "%" + playLNameTM + "%",
    "%" + playEAddressTM + "%",
    "%" + playPNumberTM + "%",
    "%" + playRewardTM + "%",
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselPlayTM, insertsPlayTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Update Player Record
app.post("/updateSinglePlayer", function (req, res) {
  // Declare Variables
  var playFNameTM = req.body.updatePlayerFNameTM;
  var playLNameTM = req.body.updatePlayerLNameTM;
  var playEAddressTM = req.body.updatePlayerEAddressTM;
  var playPNumberTM = req.body.updatePlayerPNumberTM;
  var playRewardTM = req.body.updatePlayerRewardDataTM;
  var playIdTM = req.body.updatePlayeridTM;

  // Prepare SQL Command for Update => Player Table
  var sqlinsTM =
    "UPDATE Player SET dbplayerfirstname = ?," +
    " dbplayerlastname = ?," +
    " dbplayeremailaddress = ?," +
    " dbplayerphonenumber = ?," +
    " dbrewardid = ? " +
    " WHERE dbplayerid = ?";

  // Place Values Into SQL Command
  var insertsTM = [
    playFNameTM,
    playLNameTM,
    playEAddressTM,
    playPNumberTM,
    playRewardTM,
    playIdTM,
  ];

  // Run SQL Command
  var sqlTM = mysql.format(sqlinsTM, insertsTM);
  // console.log(sql);
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("Player Updated");

    res.end();
  });
});

// Select a Single Player for update
app.get("/selectSinglePlayer", function (req, res) {
  var playeridTM = req.query.upPlayeridTM;

  // Select everything in table based on the id
  var sqlselTM = "select * from Player where dbplayerid = ?";

  // Place Values Into SQL Command
  var insertsTM = [playeridTM];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM, insertsTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Get Players
app.get("/getPlayers/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Player";
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

/* === REWARDS === */

// Get Rewards
app.get("/getRewards/", function (req, res) {
  // Use Select all Command from Table
  var sqlselTM = "select * from Reward";
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

/* === ROLES === */

// Get Roles
app.get("/getRoles/", function (req, res) {
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

/* === PRODUCTS === */

// Insert New Product

app.post("/newProduct", function (req, res) {
  // Declare Variables
  var prodNameTM = req.body.productNameTM;
  var prodDescriptionTM = req.body.productDescriptionTM;
  var prodPriceTM = req.body.productPriceTM;
  var prodQuantityTM = req.body.productQuantityTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Product(dbproductname, dbproductdescription, dbproductprice, dbproductquantity)" +
    "VALUES(?, ?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [prodNameTM, prodDescriptionTM, prodPriceTM, prodQuantityTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("Product Added!");
    res.end();
  });
});

// Select Products => For viewing (searching)
app.get("/selectProducts/", function (req, res) {
  // Declare Variables
  var prodNameTM = req.query.productNameTM;
  var prodDescriptionTM = req.query.productDescriptionTM;
  var prodPriceTM = req.query.productPriceTM;
  var prodQuantityTM = req.query.productQuantityTM;

  // Use Select Command on Table
  var sqlselProdTM =
    "Select Product.* from Product " +
    "where dbproductname Like ? " +
    "and dbproductdescription Like ? " +
    "and dbproductprice Like ? " +
    "and dbproductquantity Like ? ";

  // Place Values Into SQL Command
  var insertsProdTM = [
    "%" + prodNameTM + "%",
    "%" + prodDescriptionTM + "%",
    "%" + prodPriceTM + "%",
    "%" + prodQuantityTM + "%",
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselProdTM, insertsProdTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Update Product Record
app.post("/updateSingleProduct", function (req, res) {
  // Declare Variables
  var prodNameTM = req.body.updateProductNameTM;
  var prodDescriptionTM = req.body.updateProductDescriptionTM;
  var prodPriceTM = req.body.updateProductPriceTM;
  var prodQuantityTM = req.body.updateProductQuantityTM;
  var prodIdTM = req.body.updateProductidTM;

  // Prepare SQL Command for Update => Product Table
  var sqlinsTM =
    "UPDATE Product SET dbproductname = ?," +
    " dbproductdescription = ?," +
    " dbproductprice = ?," +
    " dbproductquantity = ? " +
    " WHERE dbproductid = ?";

  // Place Values Into SQL Command
  var insertsTM = [
    prodNameTM,
    prodDescriptionTM,
    prodPriceTM,
    prodQuantityTM,
    prodIdTM,
  ];

  // Run SQL Command
  var sqlTM = mysql.format(sqlinsTM, insertsTM);
  // console.log(sql);
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("Product Updated");

    res.end();
  });
});

// Select a Single Product for update
app.get("/selectSingleProduct", function (req, res) {
  var productidTM = req.query.upProductidTM;

  // Select everything in table based on the id
  var sqlselTM = "select * from Product where dbproductid = ?";

  // Place Values Into SQL Command
  var insertsTM = [productidTM];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM, insertsTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Get Products
app.get("/getProducts/", function (req, res) {
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

/* === RESERVATIONS === */

// Insert New Reservation

app.post("/newReservation", function (req, res) {
  // Declare Variables
  var playNameTM = req.body.playerNameTM;
  var userNameTM = req.body.userNameTM;
  var numPlayersTM = req.body.numberPlayersTM;
  var resDateTM = req.body.reservationDateTM;
  var resTimeTM = req.body.reservationTimeTM;
  var resConfirmTM = req.body.reservationConfirmTM;

  // Bring Date and Time together
  var resDateTime = resDateTM + " " + resTimeTM;

  // Prepare SQL Command for Insert
  var sqlinsTM =
    "INSERT INTO Reservation(dbuserid, dbplayerid, dbnumofplayers, dbreservationdatetime, dbreservationconfimed) " +
    "VALUES(?, ?, ?, ?, ?)";

  // Place Values Into SQL Command
  var insertsTM = [userNameTM, playNameTM, numPlayersTM, resDateTime, resConfirmTM];

  // Format SQL with Command and insertsTM
  var sqlTM = mysql.format(sqlinsTM, insertsTM);

  // Run SQL Command
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("New Reservation Added");
    res.end();
  });
});

// Select Reservations => For viewing (searching)
app.get("/selectReservations/", function (req, res) {
  // Declare Variables
  var userNameTM = req.query.userNameTM;
  var playFNameTM = req.query.playerFNameTM;
  var playLNameTM = req.query.playerLNameTM;
  var numPlayersTM = req.query.numberPlayersTM;
  var resDateTM = req.query.reservationDateTM;
  var resTimeTM = req.query.reservationTimeTM;
  var resConfirmTM = req.query.reservationConfirmTM;

  // Split userNameTM into userNameSplit
  // Assign the index to First and Last Name
  var userSplitTM = userNameTM.split(" ");
  // console.log(userSplitTM.length)

  // Checkt to see if array is empty
  if (userSplitTM.length === 1) {
    // If so pass empty string to show everyting
    var userFNameTM = "";
    var userLNameTM = "";
  } else {
    // Otherwise only show the user's name
    var userFNameTM = userSplitTM[0];
    var userLNameTM = userSplitTM[1];
  }

  // Bring Date and Time together
  var resDateTimeTM = resDateTM + " " + resTimeTM;

  // Check the value in resConfirmTM
  // Based on the value run the following SQL Command and with a specified value
  if (resConfirmTM == 1 || resConfirmTM == 0) {
    var resConfirmAddonTM = "and dbreservationconfimed = ? ";
    var resConfirmVarTM = resConfirmTM;
  } else {
    var resConfirmAddonTM = "and dbreservationconfimed Like ? ";
    var resConfirmVarTM = "%%";
  }

  // Use Select Command on Table
  var sqlselResTM =
    "Select Reservation.*, " +
    "User.dbuserfirstname, User.dbuserlastname, " +
    "Player.dbplayerfirstname, Player.dbplayerlastname from Reservation " +
    "inner join User on User.dbuserid = Reservation.dbuserid " +
    "inner join Player on Player.dbplayerid = Reservation.dbplayerid " +
    "where User.dbuserfirstname Like ? " +
    "and User.dbuserlastname Like ? " +
    "and dbplayerfirstname Like ? " +
    "and dbplayerlastname Like ? " +
    "and dbnumofplayers Like ? " +
    "and dbreservationdatetime Like ? " +
    resConfirmAddonTM;
  // Place Values Into SQL Command
  var insertsResTM = [
    "%" + userFNameTM + "%",
    "%" + userLNameTM + "%",
    "%" + playFNameTM + "%",
    "%" + playLNameTM + "%",
    "%" + numPlayersTM + "%",
    "%" + resDateTimeTM + "%",
    resConfirmVarTM,
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselResTM, insertsResTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Update Reservation Record
app.post("/updateSingleReservation", function (req, res) {
  // Declare Variables
  var playNameTM = req.body.updatePlayerNameTM;
  var userNameTM = req.body.updateUserNameTM;
  var numPlayersTM = req.body.updateNumberPlayersTM;
  var resDateTM = req.body.updateReservationDateTM;
  var resTimeTM = req.body.updateReservationTimeTM;
  var resConfirmTM = req.body.updateReservationConfirmTM;
  var resIdTM = req.body.updateReservationidTM;

  // Bring Date and Time together
  var resDateTimeTM = resDateTM + " " + resTimeTM;

  // Prepare SQL Command for Update => Reservation Table
  var sqlinsTM =
    "UPDATE Reservation SET dbuserid = ?," +
    " dbplayerid = ?," +
    " dbnumofplayers = ?, " +
    " dbreservationdatetime = ?," +
    " dbreservationconfimed = ? " +
    " WHERE dbreservationid = ?";

  // Place Values Into SQL Command
  var insertsTM = [
    userNameTM,
    playNameTM,
    numPlayersTM,
    resDateTimeTM,
    resConfirmTM,
    resIdTM,
  ];

  // Run SQL Command
  var sqlTM = mysql.format(sqlinsTM, insertsTM);
  // console.log(sqlTM);
  con.execute(sqlTM, function (err, result) {
    if (err) throw err;
    // console.log("Product Updated");

    res.end();
  });
});

// Select a Single Reservation for update
app.get("/selectSingleReservation", function (req, res) {
  var reservationidTM = req.query.upReservationidTM;

  // Select everything in table based on the id
  var sqlselTM = "select * from Reservation where dbreservationid = ?";

  // Place Values Into SQL Command
  var insertsTM = [reservationidTM];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM, insertsTM);

  // console.log(sqlTM);

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

/* === Purchase === */

// Insert New Purchase

app.post("/newPurchase", function (req, res) {
  // Declare Variables
  var playNameTM = req.body.playerNameTM;
  var userNameTM = req.body.userNameTM;
  var prodItemTM = req.body.productItemTM;
  var statusPurchaseTM = req.body.statusOfPurchaseTM;
  var purchQuantityTM = req.body.purchaseQuantityTM;
  var purchPriceTotalTM = req.body.purchasePriceTotalTM;

  /*
    |------------------------------------------------------------------------------------------|
        
                                          --: NOTE :--
                         --- THERE ARE THREE INSERTS IN NEW PURCHASE --- 
      
      || - Purchase => Insert User, Player, and PurchaseDateTime Data                       ||
      || - Purchase Detail => Insert Purchase ID, Product, Quantity and Price Total Data    ||
      || - Status => Insert Purchase Detail ID, Status Name, StatusDateTime                 ||
      
                                      ALL WILL GO INTO DATABASE

    |------------------------------------------------------------------------------------------|
  */

  /* PURCHASE INSERT */

  // Prepare SQL Command for Insert in Purchase
  var sqlinsPurchaseTM =
    "INSERT INTO Purchase(dbuserid, dbplayerid, dbpurchasedatetime) " +
    "VALUES(?, ?, now())";

  // Place Values Into SQL Command
  var insertsPurchaseTM = [userNameTM, playNameTM];

  // Format SQL with Command and insertsTM
  var sqlPurchaseTM = mysql.format(sqlinsPurchaseTM, insertsPurchaseTM);

  // Run SQL Command
  con.execute(sqlPurchaseTM, function (err, result) {
    if (err) throw err;

    // console.log("Purchase Added!");

    // Get New Primary Key from Purchase
    var purchasePrimaryKeyTM = result.insertId;

    /* PURCHASE DETAIL INSERT */

    // Prepare SQL Command for Insert in Purchase Detail
    var sqlinsPurchaseDetailTM =
      "INSERT INTO PurchaseDetail(dbpurchaseid, dbproductid, dbpurchasedetailquantity, dbpurchasedetailpricetotal) " +
      "VALUES(?, ?, ?, ?)";

    // Place Values Into SQL Command
    var insertsPurchaseDetailTM = [
      purchasePrimaryKeyTM,
      prodItemTM,
      purchQuantityTM,
      purchPriceTotalTM,
    ];

    // Format SQL with Command and insertsTM
    var sqlPurchaseDetailTM = mysql.format(
      sqlinsPurchaseDetailTM,
      insertsPurchaseDetailTM
    );
    // Run SQL Command
    con.execute(sqlPurchaseDetailTM, function (err, result) {
      if (err) throw err;

      // console.log("Purchase Detail Added!");

      // Get New Primary Key from Purchase Detail
      var purchaseDetailPrimaryKeyTM = result.insertId;

      /* STATUS INSERT */

      // Prepare SQL Command for Insert in STATUS
      var sqlinsStatusTM =
        "INSERT INTO Status(dbpurchasedetailid, dbstatusname, dbstatusdatetime) " +
        "VALUES(?, ?, now())";

      // Place Values Into SQL Command
      var insertsStatusTM = [purchaseDetailPrimaryKeyTM, statusPurchaseTM];

      // Format SQL with Command and insertsTM
      var sqlStatusTM = mysql.format(sqlinsStatusTM, insertsStatusTM);

      // Run SQL Command
      con.execute(sqlStatusTM, function (err, result) {
        if (err) throw err;
        // console.log("Status Added!");
        res.end();
      });
    });
  });
});

// Select Purchases => For viewing (searching)

/*
  |------------------------------------------------------------------------------------------|
                                        : --- NOTE --- : 

                                In this Select it's joining:                                    
        || Users, Players, Purchases, Purchase Details, Products, and Status into ONE              


        || This provides the end-user a clean experience of which user help that player,          
        || The date and time of the transaction, what was bought, the total of the purchase,                                                                              
        || How many products was sold, and if the purchase has been completed or not              
  |------------------------------------------------------------------------------------------|
*/

app.get("/selectPurchases/", function (req, res) {
  // Declare Variables
  var userNameTM = req.query.userNameTM;
  var playFNameTM = req.query.playerFNameTM;
  var playLNameTM = req.query.playerLNameTM;
  var prodItemTM = req.query.productItemTM;
  var purchDateTM = req.query.purchaseDateTM;
  var purchTimeTM = req.query.purchaseTimeTM;
  var purchQuantityTM = req.query.purchaseQuantityTM;
  var purchPriceTotalTM = req.query.purchasePriceTotalTM;
  var statusPurchaseTM = req.query.statusOfPurchaseTM;

  // Split userNameTM into userNameSplit
  // Assign the index to First and Last Name
  var userSplitTM = userNameTM.split(" ");
  // console.log(userSplitTM.length)

  // Checkt to see if array is empty
  if (userSplitTM.length === 1) {
    // If so pass empty string to show everyting
    var userFNameTM = "";
    var userLNameTM = "";
  } else {
    // Otherwise only show the user's name
    var userFNameTM = userSplitTM[0];
    var userLNameTM = userSplitTM[1];
  }

  // Bring Date and Time together
  var purchDateTimeTM = purchDateTM + " " + purchTimeTM;

  // Use Select Command on Table
  var sqlselPurchTM =
    "Select Purchase.*, " +
    "PurchaseDetail.*, Product.dbproductname, Status.dbstatusname," +
    "User.dbuserfirstname, User.dbuserlastname, " +
    "Player.dbplayerfirstname, Player.dbplayerlastname from Purchase " +
    "inner join User on User.dbuserid = Purchase.dbuserid " +
    "inner join Player on Player.dbplayerid = Purchase.dbplayerid " +
    "inner join PurchaseDetail on PurchaseDetail.dbpurchaseid = Purchase.dbpurchaseid " +
    "inner join Product on Product.dbproductid = PurchaseDetail.dbproductid " +
    "inner join Status on Status.dbpurchasedetailid = PurchaseDetail.dbpurchasedetailid " +
    "where User.dbuserfirstname Like ? " +
    "and User.dbuserlastname Like ? " +
    "and Player.dbplayerfirstname Like ? " +
    "and Player.dbplayerlastname Like ? " +
    "and Purchase.dbpurchasedatetime Like ? " +
    "and Product.dbproductname Like ? " +
    "and PurchaseDetail.dbpurchasedetailquantity Like ? " +
    "and PurchaseDetail.dbpurchasedetailpricetotal Like ? " +
    "and Status.dbstatusname Like ? ";

  // Place Values Into SQL Command
  var insertsPurchTM = [
    "%" + userFNameTM + "%",
    "%" + userLNameTM + "%",
    "%" + playFNameTM + "%",
    "%" + playLNameTM + "%",
    "%" + purchDateTimeTM + "%",
    "%" + prodItemTM + "%",
    "%" + purchQuantityTM + "%",
    "%" + purchPriceTotalTM + "%",
    "%" + statusPurchaseTM + "%",
  ];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselPurchTM, insertsPurchTM);

  // console.log(sqlTM);

  // Run SQL Command
  con.query(sqlTM, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

// Update Purchase Record
app.post("/updateSinglePurchase", function (req, res) {
  // Declare Variables
  var playNameTM = req.body.updatePlayerNameTM;
  var userNameTM = req.body.updateUserNameTM;
  var prodItemTM = req.body.updateProductItem;
  var statusPurchaseTM = req.body.updateStatusTM;
  var purchDateTM = req.body.updatePurchaseDateTM;
  var purchTimeTM = req.body.updatePurchaseTimeTM;
  var purchQuantityTM = req.body.updatePurchaseQuantityTM;
  var purchPriceTotalTM = req.body.updatePurchasePriceTotalTM;
  var purchIdTM = req.body.updatePurchaseidTM;
  var statusDateTimeTM = "";

  // Bring Date and Time together
  var purchDateTimeTM = purchDateTM + " " + purchTimeTM;

  // Prepare SQL for Select to get previous status name and status date
  var sqlinsStatusSelect =
    "Select dbpurchaseid, (dbstatusname) as oldStatusNameTM, " +
    "(dbstatusdatetime) as oldStatusDateTimeTM from PurchaseDetail " +
    " inner join Status on Status.dbpurchasedetailid = PurchaseDetail.dbpurchasedetailid " +
    " where dbpurchaseid = ?";

  // Prepare insert
  var insertSelectTM = [purchIdTM];

  // Run SQL Command
  var sqlSelectTM = mysql.format(sqlinsStatusSelect, insertSelectTM);
  // console.log(sqlSelectTM);
  con.query(sqlSelectTM, function (err, data) {
    if (err) throw err;
    // console.log(data[0].oldStatusNameTM);

    // Check to see if Updated Status name is the same as the old one
    if (statusPurchaseTM === data[0].oldStatusNameTM) {
      // console.log("NO CHANGE IN STATUS");
      // If so keep the old status date
      statusDateTimeTM = data[0].oldStatusDateTimeTM;
      // console.log(oldStatusDateTime);

      /* Update Purchase Table*/

      // Prepare SQL Command for Update => Purchase Table
      var sqlinsPurchaseTM =
        "UPDATE Purchase SET dbuserid = ?," +
        " dbplayerid = ?," +
        " dbpurchasedatetime = ?" +
        " WHERE dbpurchaseid = ?";

      // Place Values Into SQL Command
      var insertsPurchaseTM = [
        userNameTM,
        playNameTM,
        purchDateTimeTM,
        purchIdTM,
      ];

      // Run SQL Command
      var sqlPurchaseTM = mysql.format(sqlinsPurchaseTM, insertsPurchaseTM);
      // console.log(sqlTM);
      con.execute(sqlPurchaseTM, function (err, result) {
        if (err) throw err;
        // console.log("Purchase Record Updated!");

        /* Update Purchase Detail*/

        // Prepare SQL Command for Update => Purchase Table
        var sqlinsPurchaseDetailTM =
          "UPDATE PurchaseDetail SET dbproductid = ?," +
          " dbpurchasedetailquantity = ?," +
          " dbpurchasedetailpricetotal = ?" +
          " WHERE dbpurchaseid = ?";

        // Place Values Into SQL Command
        var insertsPurchaseDetailTM = [
          prodItemTM,
          purchQuantityTM,
          purchPriceTotalTM,
          purchIdTM,
        ];

        // Run SQL Command
        var sqlPurchaseDetailTM = mysql.format(
          sqlinsPurchaseDetailTM,
          insertsPurchaseDetailTM
        );
        // console.log(sqlTM);
        con.execute(sqlPurchaseDetailTM, function (err, result) {
          if (err) throw err;
          // console.log("Purchase Detail Record Updated!");

          /* Update Status*/

          // Prepare SQL Command for Update => Purchase Table
          var sqlinsStatusTM =
            "UPDATE Status INNER JOIN PurchaseDetail on Status.dbpurchasedetailid = PurchaseDetail.dbpurchasedetailid " +
            " SET dbstatusname = ?," +
            " dbstatusdatetime = ? " +
            " WHERE PurchaseDetail.dbpurchaseid = ?";

          // Place Values Into SQL Command
          var insertsStatusTM = [statusPurchaseTM, statusDateTimeTM, purchIdTM];

          // Run SQL Command
          var sqlStatusTM = mysql.format(sqlinsStatusTM, insertsStatusTM);

          con.execute(sqlStatusTM, function (err, result) {
            if (err) throw err;
            // console.log("Staus Record Updated!");
            res.end();
          });
        });
      });
    } else {
      // Otherwise update the status time

      /* Update Purchase Table*/

      // Prepare SQL Command for Update => Purchase Table
      var sqlinsPurchaseTM =
        "UPDATE Purchase SET dbuserid = ?," +
        " dbplayerid = ?," +
        " dbpurchasedatetime = ?" +
        " WHERE dbpurchaseid = ?";

      // Place Values Into SQL Command
      var insertsPurchaseTM = [
        userNameTM,
        playNameTM,
        purchDateTimeTM,
        purchIdTM,
      ];

      // Run SQL Command
      var sqlPurchaseTM = mysql.format(sqlinsPurchaseTM, insertsPurchaseTM);
      // console.log(sqlTM);
      con.execute(sqlPurchaseTM, function (err, result) {
        if (err) throw err;
        // console.log("Purchase Record Updated!");

        /* Update Purchase Detail*/

        // Prepare SQL Command for Update => Purchase Table
        var sqlinsPurchaseDetailTM =
          "UPDATE PurchaseDetail SET dbproductid = ?," +
          " dbpurchasedetailquantity = ?," +
          " dbpurchasedetailpricetotal = ?" +
          " WHERE dbpurchaseid = ?";

        // Place Values Into SQL Command
        var insertsPurchaseDetailTM = [
          prodItemTM,
          purchQuantityTM,
          purchPriceTotalTM,
          purchIdTM,
        ];

        // Run SQL Command
        var sqlPurchaseDetailTM = mysql.format(
          sqlinsPurchaseDetailTM,
          insertsPurchaseDetailTM
        );
        // console.log(sqlTM);
        con.execute(sqlPurchaseDetailTM, function (err, result) {
          if (err) throw err;
          // console.log("Purchase Detail Record Updated!");

          /* Update Status*/

          // Prepare SQL Command for Update => Purchase Table
          var sqlinsStatusTM =
            "UPDATE Status INNER JOIN PurchaseDetail on Status.dbpurchasedetailid = PurchaseDetail.dbpurchasedetailid " +
            " SET dbstatusname = ?," +
            " dbstatusdatetime = now() " +
            " WHERE PurchaseDetail.dbpurchaseid = ?";

          // Place Values Into SQL Command
          var insertsStatusTM = [statusPurchaseTM, purchIdTM];

          // Run SQL Command
          var sqlStatusTM = mysql.format(sqlinsStatusTM, insertsStatusTM);

          con.execute(sqlStatusTM, function (err, result) {
            if (err) throw err;
            // console.log("Staus Record Updated!");
            res.end();
          });
        });
      });
    }
  });
});

// Select a Single Purchase for update
app.get("/selectSinglePurchase", function (req, res) {
  var purcahseidTM = req.query.upPurchaseidTM;

  // Select everything in table based on the id
  var sqlselTM =
    "Select Purchase.*, PurchaseDetail.*, Status.* from Purchase " +
    "inner join PurchaseDetail on PurchaseDetail.dbpurchaseid = Purchase.dbpurchaseid " +
    "inner join Status on Status.dbpurchasedetailid = PurchaseDetail.dbpurchasedetailid " +
    "where Purchase.dbpurchaseid = ?";

  // Place Values Into SQL Command
  var insertsTM = [purcahseidTM];

  // Format SQL Command
  var sqlTM = mysql.format(sqlselTM, insertsTM);

  // console.log(sqlTM);

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
