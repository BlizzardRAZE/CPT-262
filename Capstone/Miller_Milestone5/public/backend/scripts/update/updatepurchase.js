// Create Purchase box for Purchase
var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { data: [], loginData: [], viewThePageTM: 0 };
  },
  loadPurchasesFromServer: function () {
    // Connect to database
    // To get data from table
    $.ajax({
      url: "/selectPurchases",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        userNameTM: userTypeTM.value,
        purchaseDateTM: purchaseDateTM.value,
        purchaseTimeTM: purchaseTimeTM.value,
        productItemTM: productTypeTM.value,
        purchaseQuantityTM: purchaseQuantityTM.value,
        purchasePriceTotalTM: purchasePriceTotalTM.value,
        statusOfPurchaseTM: statusTypeTM.value,
      },

      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  updateSinglePurchaseFromServer: function (purchase) {
    // Connect to database
    // To push new updated data to table
    $.ajax({
      url: "/updateSinglePurchase",
      dataType: "json",
      data: purchase,
      type: "POST",
      cache: false,
      success: function (upSinglePurchaseDataTM) {
        this.setState({ upSinglePurchaseDataTM: upSinglePurchaseDataTM });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },

  // Get the Role Id to see if user can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getUserLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ loginData: datalog });
        this.setState({ viewThePageTM: this.state.loginData[0].dbroleid });
        this.loadPurchasesFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadPurchasesFromServer, this.props.pollInterval);
  },

  // Render the box to HTML
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (
      this.state.viewThePageTM == 0 ||
      (this.state.viewThePageTM != 1 && this.state.viewThePageTM != 2)
    ) {
      return (
        <div className="permissionErrorContainer">
          <span>
            Sorry! You don't have permission to interact with this page!
          </span>
        </div>
      );
    } else {
      return (
        <div>
          {/* Show the select form */}
          <h1>Update Purchase</h1>
          <PurchaseSelectForm onPurchaseSubmit={this.loadPurchasesFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              {/* Create Table and put data from database into here (Use the List) */}
              <table id="resultData">
                <thead>
                  <tr>
                    <th>User's First Name</th>
                    <th>User's Last Name</th>
                    <th>Player's First Name</th>
                    <th>Player's Last Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                {/* Show data from database into list */}
                <PurchaseList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              {/* Show the Update Form */}
              <PurchaseUpdateForm
                onUpdateSubmit={this.updateSinglePurchaseFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

// Create Form for page
var PurchaseSelectForm = React.createClass({
  // Get User Data
  loadUsersNames: function () {
    $.ajax({
      url: "/getUsers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ userDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Get Product Data
  loadProductNames: function () {
    $.ajax({
      url: "/getProducts",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ productDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadUsersNames();
    this.loadProductNames();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      userDataTM: [],
      productDataTM: [],
      playerFNameTM: "",
      playerLNameTM: "",
      purchaseDateTM: "",
      purchaseTimeTM: "",
      purchaseQuantityTM: "",
      purchasePriceTotalTM: "",
    };
  },

  // Handle the change when the user interacts with Radio button
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var userNameTM = userTypeTM.value;
    var playerFNameTM = this.state.playerFNameTM.trim();
    var playerLNameTM = this.state.playerLNameTM.trim();
    var purchaseDateTM = this.state.purchaseDateTM.trim();
    var purchaseTimeTM = this.state.purchaseTimeTM.trim();
    var productItemTM = productTypeTM.value;
    var purchaseQuantityTM = this.state.purchaseQuantityTM.trim();
    var purchasePriceTotalTM = this.state.purchasePriceTotalTM.trim();
    var statusOfPurchaseTM = statusTypeTM.value;

    // Use Values in Text boxes to submit to database
    this.props.onPurchaseSubmit({
      userNameTM: userNameTM,
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      purchaseDateTM: purchaseDateTM,
      purchaseTimeTM: purchaseTimeTM,
      productItemTM: productItemTM,
      purchaseQuantityTM: purchaseQuantityTM,
      purchasePriceTotalTM: purchasePriceTotalTM,
      statusOfPurchaseTM: statusOfPurchaseTM,
    });
  },
  // Update the value for variable when user interacts with input
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render the form
  render: function () {
    return (
      // Create HTML Form
      <form onSubmit={this.handleSubmit} className="formContainer">
        {/* Create Header */}
        <h2>Search a Purchase</h2>
        {/* Create Table to hold form */}
        <table>
          <tbody>
            <tr>
              {/* Create User Select List */}
              <th>Select User</th>
              <td>
                <SelectListUsers
                  data={this.state.userDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            {/* Display Player's First Name for Input */}
            <tr>
              <th>Player's First Name</th>
              <td>
                <input
                  type="text"
                  name="playerFNameTM"
                  id="playerFNameTM"
                  value={this.state.playerFNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Player's Last Name for Input */}
            <tr>
              <th>Player's Last Name</th>
              <td>
                <input
                  type="text"
                  name="playerLNameTM"
                  id="playerLNameTM"
                  value={this.state.playerLNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              {/* Create Product Select List */}
              <th>Select Product</th>
              <td>
                <SelectListProducts
                  data={this.state.productDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            <tr>
              {/* Create Status Select List */}
              <th>Select Status of Purchase</th>
              <td>
                <SelectListStatus validate={this.validateSelectList} />
              </td>
            </tr>
            <tr>
              {/* Display Purchase Date for Input */}
              <th>Purchase Date</th>
              <td>
                <input
                  type="date"
                  name="purchaseDateTM"
                  id="purchaseDateTM"
                  value={this.state.purchaseDateTM}
                  onChange={this.handleChange}
                ></input>
              </td>
            </tr>
            <tr>
              {/* Display Purchase Quantity for Input */}
              <th>Purchase Time</th>
              <td>
                <input
                  type="time"
                  name="purchaseTimeTM"
                  id="purchaseTimeTM"
                  value={this.state.purchaseTimeTM}
                  onChange={this.handleChange}
                ></input>
              </td>
            </tr>
            {/* Display Purchase Quantity for Input */}
            <tr>
              <th>Purchase Quantity</th>
              <td>
                <input
                  type="text"
                  name="purchaseQuantityTM"
                  id="purchaseQuantityTM"
                  value={this.state.purchaseQuantityTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Player's Last Name for Input */}
            <tr>
              <th>Purchase Total</th>
              <td>
                <input
                  type="text"
                  name="purchasePriceTotalTM"
                  id="purchasePriceTotalTM"
                  value={this.state.purchasePriceTotalTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Submit button to Search Purchase */}
        <input type="submit" value="Search Purchase" id="buttonSubmit" />
      </form>
    );
  },
});

// Display Update Form
var PurchaseUpdateForm = React.createClass({
  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updatePlayerDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Get User Data
  loadUsersNames: function () {
    $.ajax({
      url: "/getUsers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updateUserDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Get Product Data
  loadProductNames: function () {
    $.ajax({
      url: "/getProducts",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updateProductDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadPlayerNames();
    this.loadUsersNames();
    this.loadProductNames();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      updatePurchaseidTM: "",
      updatePurchaseDetailidTM: "",
      updatePlayerDataTM: [],
      updateUserDataTM: [],
      updateProductDataTM: [],
      updatePurchaseQuantityTM: "",
      updatePurchasePriceTotalTM: "",
    };
  },

  // Handle the change when the user interacts with Radio button
  handleUpOptionChange: function (e) {
    this.setState({
      upPurchaseSelectedOptionTM: e.target.value,
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var updatePurchaseidTM = upPurchaseidTM.value;
    var updatePlayerNameTM = upPlayerTypeTM.value;
    var updateUserNameTM = upUserTypeTM.value;
    var updateProductItem = upProductTypeTM.value;
    var updateStatusTM = upStatusTypeTM.value;
    var updatePurchaseDateTM = upPurchaseDateTM.value;
    var updatePurchaseTimeTM = upPurchaseTimeTM.value;
    var updatePurchaseQuantityTM = upPurchaseQuantityTM.value;
    var updatePurchasePriceTotalTM = upPurchasePriceTotalTM.value;

    // Validate if the user selected an item from player
    if (!this.validateSelectList(updatePlayerNameTM)) {
      window.alert("Select a Player.");
      return;
    }

    // Validate if the user selected an item from user
    if (!this.validateSelectList(updateUserNameTM)) {
      window.alert("Select a User.");
      return;
    }

    // Validate if the user selected an item from product
    if (!this.validateSelectList(updateProductItem)) {
      window.alert("Select a Product.");
      return;
    }

    // Validate if the user selected an item from Status
    if (!this.validateSelectList(updateStatusTM)) {
      window.alert(
        "Select the Status of the Purchase.\nIs Order: Complete, Back Ordered, being Shipped, or being Processed?"
      );
      return;
    }

    // Validate the Purchase Date
    if (!updatePurchaseDateTM) {
      // Show Error to User
      window.alert("Please Enter a Purchase Date.");
      return;
    }

    // Validate the Purchase Time
    if (!updatePurchaseTimeTM) {
      // Show Error to User
      window.alert("Please Enter a Purchase Time.");
      return;
    }
    // Validate the Purchase Quantity
    if (
      isNaN(updatePurchaseQuantityTM) ||
      updatePurchaseQuantityTM.length === 0 ||
      updatePurchaseQuantityTM <= 0 ||
      updatePurchaseQuantityTM > 99999
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Quantity Number for Product Purchased\nMake sure it is in the Range of 0 and 99,999 Units.\nEx: 5000"
      );
      return;
    }

    // Validate the Product Price
    if (
      isNaN(updatePurchasePriceTotalTM) ||
      updatePurchasePriceTotalTM.length === 0 ||
      updatePurchasePriceTotalTM <= 0 ||
      updatePurchasePriceTotalTM > 9999.99
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Price for Product Purchased\nMake sure it is in the Range of $0 and $9,999.\nEx: $5000.00"
      );
      return;
    }

    if (
      !updatePlayerNameTM ||
      !updateUserNameTM ||
      !updateProductItem ||
      !updateStatusTM ||
      !updatePurchaseDateTM ||
      !updatePurchaseTimeTM ||
      !updatePurchaseQuantityTM ||
      !updatePurchasePriceTotalTM
    ) {
      //   console.log("Field Missing");
      return;
    }

    // Show confirm button if user wants to processed with the update
    if (confirm("Are you sure you want to update record?") == true) {
      // Use Values in Text boxes to submit to database
      this.props.onUpdateSubmit({
        updatePurchaseidTM: updatePurchaseidTM,
        updatePlayerNameTM: updatePlayerNameTM,
        updateUserNameTM: updateUserNameTM,
        updateProductItem: updateProductItem,
        updateStatusTM: updateStatusTM,
        updatePurchaseDateTM: updatePurchaseDateTM,
        updatePurchaseTimeTM: updatePurchaseTimeTM,
        updatePurchaseQuantityTM: updatePurchaseQuantityTM,
        updatePurchasePriceTotalTM: updatePurchasePriceTotalTM,
      });

      // Show Message to User when data is updated
      window.alert("Purchase Updated!");
    } else {
      window.alert("Update Canceled!");
    }
  },

  //Regex to Validate Email Address
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  // Regex to Validate Phone Number
  phoneNumberValidate: function (value) {
    var phoneRegex = /^[\(][0-9]{3}[\)][\-][0-9]{3}[\-][0-9]{4}$/im;
    return phoneRegex.test(value);
  },

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    // console.log(userSelectedOption);
    if (!userSelectedOption) {
      return false;
    } else {
      return true;
    }
  },

  // Set Common Validate for other Validations
  commonValidate: function () {
    return true;
  },

  // Update the value for variable when user interacts with input
  handleUpChange: function (event) {
    this.setState({
      // test: console.log(event.target.id),
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <h2>Update Purchase</h2>
            <table>
              <tbody>
                <tr>
                  {/* Create Player Select List */}
                  <th>Select Player</th>
                  <td>
                    <SelectUpdateListPlayers
                      validate={this.validateSelectList}
                      data={this.state.updatePlayerDataTM}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Create User Select List */}
                  <th>Select User</th>
                  <td>
                    <SelectUpdateListUsers
                      validate={this.validateSelectList}
                      data={this.state.updateUserDataTM}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Create Product Select List */}
                  <th>Select Product</th>
                  <td>
                    <SelectUpdateListProducts
                      data={this.state.updateProductDataTM}
                      validate={this.validateSelectList}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Create Status Select List */}
                  <th>Select Status</th>
                  <td>
                    <SelectUpdateListStatus
                      validate={this.validateSelectList}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Display Purchase Date for Input */}
                  <th>Purchase Date</th>
                  <td>
                    <input
                      type="date"
                      name="upPurchaseDateTM"
                      id="upPurchaseDateTM"
                      value={this.state.upPurchaseDateTM}
                      onChange={this.handleChange}
                    ></input>
                  </td>
                </tr>
                <tr>
                  {/* Display Purchase Time for Input */}
                  <th>Purchase Time</th>
                  <td>
                    <input
                      type="time"
                      name="upPurchaseTimeTM"
                      id="upPurchaseTimeTM"
                      value={this.state.upPurchaseTimeTM}
                      onChange={this.handleChange}
                    ></input>
                  </td>
                </tr>
                <tr>
                  {/* Display Purchase Quantity for Input */}
                  <th>Purchase Quantity</th>
                  <td>
                    <input
                      type="text"
                      name="upPurchaseQuantityTM"
                      id="upPurchaseQuantityTM"
                      value={this.state.upPurchaseQuantityTM}
                      onChange={this.handleChange}
                    ></input>
                  </td>
                </tr>
                <tr>
                  {/* Display Purchase Price Total for Input */}
                  <th>Purchase Price Total</th>
                  <td>
                    <input
                      type="text"
                      name="upPurchasePriceTotalTM"
                      id="upPurchasePriceTotalTM"
                      value={this.state.upPurchasePriceTotalTM}
                      onChange={this.handleChange}
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upPurchaseidTM"
              id="upPurchaseidTM"
              onChange={this.handleUpChange}
            />
            {/* Show Submit Button to Submit the form */}
            <input type="submit" value="Update Purchase" id="buttonSubmit" />
          </form>
        </div>
      </div>
    );
  },
});

// Display Purchase Information
var PurchaseList = React.createClass({
  // Render in data for database
  render: function () {
    var purchaseNodes = this.props.data.map(function (purchaseTM) {
      //map the data
      return (
        <Purchase
          key={purchaseTM.dbpurchaseid}
          purchIdTM={purchaseTM.dbpurchaseid}
          purchDetailIdTM={purchaseTM.dbpurchasedetailid}
          userFNameTM={purchaseTM.dbuserfirstname}
          userLNameTM={purchaseTM.dbuserlastname}
          playFNameTM={purchaseTM.dbplayerfirstname}
          playLNameTM={purchaseTM.dbplayerlastname}
          purchDTTM={purchaseTM.dbpurchasedatetime}
          purhProductTM={purchaseTM.dbproductname}
          purchQuantityTM={purchaseTM.dbpurchasedetailquantity}
          purchTotalTM={purchaseTM.dbpurchasedetailpricetotal}
          statusMessTM={purchaseTM.dbstatusname}
        ></Purchase>
      );
    });

    //Print all the nodes in the list
    return <tbody>{purchaseNodes}</tbody>;
  },
});

var Purchase = React.createClass({
  getInitialState: function () {
    return {
      upPurchaseidTM: "",
      singlePurchDataTM: [],
    };
  },

  // Get id from text box and pass it to function to populate input fields for update form
  updateRecord: function (e) {
    e.preventDefault();
    var theUpPurchTM = this.props.purchIdTM;

    this.loadSinglePurchase(theUpPurchTM);
  },

  loadSinglePurchase: function (theUpPurchTM) {
    $.ajax({
      url: "/selectSinglePurchase",
      data: {
        upPurchaseidTM: theUpPurchTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singlePurchDataTM: data });
        // console.log(this.state.singlePurchDataTM);

        // Get values from database and assign them to input fields to show
        var populatePurchase = this.state.singlePurchDataTM.map(function (
          purchase
        ) {
          upPurchaseidTM.value = theUpPurchTM;
          upUserTypeTM.value = purchase.dbuserid;
          upPlayerTypeTM.value = purchase.dbplayerid;
          upProductTypeTM.value = purchase.dbproductid;
          upStatusTypeTM.value = purchase.dbstatusname;
          var upPurchaseDateTimeTM = purchase.dbpurchasedatetime;
          upPurchaseQuantityTM.value = purchase.dbpurchasedetailquantity;
          upPurchasePriceTotalTM.value = purchase.dbpurchasedetailpricetotal;

          // Declare Variables
          var dateTimeSplitTM = "";
          var dateTM = "";
          var timeTM = "";

          // Split the upPurchaseDateTimeTM
          dateTimeSplitTM = upPurchaseDateTimeTM.toString().split(" ");

          // Assign parts of dateTimeTM to date and sqlTimeTM
          dateTM = dateTimeSplitTM[0];
          timeTM = dateTimeSplitTM[1].substr(0, 5);

          // Pass values

          upPurchaseDateTM.value = dateTM;
          upPurchaseTimeTM.value = timeTM;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    // Spit the DateTime
    var dateTimeSplitTM = this.props.purchDTTM.split(" ");
    // Create Variables
    var pieceOfTimeTM = "";
    var pieceOfDateTM = "";
    var dateTM = "";

    // Format Date
    // Get date from SQL
    pieceOfDateTM = dateTimeSplitTM[0];

    // Slice the pieceOfDateTM
    pieceOfDateTM = pieceOfDateTM.split("-");
    dateTM =
      +pieceOfDateTM[1] + "/" + pieceOfDateTM[2] + "/" + pieceOfDateTM[0];

    // console.log(pieceOfDateTM);

    // Convert 24-hour to 12-hour
    // console.log(dateTimeSplitTM[1]);

    // Get Time from SQL and Check to see if its time
    var pieceOfTimeTM = dateTimeSplitTM[1]
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    // Slice the pieceOfTimeTM
    pieceOfTimeTM = pieceOfTimeTM.slice(1);

    // Check if hours is above 12 to give PM, otherwise give AM
    pieceOfTimeTM[5] = +pieceOfTimeTM[0] < 12 ? "AM" : "PM";

    // Fix the hours to be 12-Hour Format
    pieceOfTimeTM[0] = +pieceOfTimeTM[0] % 12 || 12;

    //Display info
    return (
      <tr>
        <td>{this.props.userFNameTM}</td>
        <td>{this.props.userLNameTM}</td>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{dateTM}</td>
        <td>{pieceOfTimeTM}</td>
        <td>{this.props.purhProductTM}</td>
        <td>{this.props.purchQuantityTM}</td>
        <td>{this.props.purchTotalTM}</td>
        <td>{this.props.statusMessTM}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" id="buttonSubmit" />
          </form>
        </td>
      </tr>
    );
  },
});

// Select List for Users
var SelectListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option
          key={userTypesTM.dbuserid}
          value={userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        >
          {userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        </option>
      );
    });
    return (
      <select name="userTypeTM" id="userTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Product
var SelectListProducts = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (productTypesTM) {
      return (
        <option
          key={productTypesTM.dbproductid}
          value={productTypesTM.dbproductid}
        >
          {productTypesTM.dbproductname}
        </option>
      );
    });
    return (
      <select name="productTypeTM" id="productTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Status
var SelectListStatus = React.createClass({
  render: function () {
    return (
      <select name="statusTypeTM" id="statusTypeTM">
        <option></option>
        <option value="Complete">Complete</option>
        <option value="Back-Order">Back-Order</option>
        <option value="Shipping">Shipping</option>
        <option value="Processing">Processing</option>
      </select>
    );
  },
});

// Select Update List for Players
var SelectUpdateListPlayers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option key={playerTypesTM.dbplayerid} value={playerTypesTM.dbplayerid}>
          {playerTypesTM.dbplayerfirstname +
            " " +
            playerTypesTM.dbplayerlastname}
        </option>
      );
    });
    return (
      <select name="upPlayerTypeTM" id="upPlayerTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select Update List for Users
var SelectUpdateListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option key={userTypesTM.dbuserid} value={userTypesTM.dbuserid}>
          {userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        </option>
      );
    });
    return (
      <select name="upUserTypeTM" id="upUserTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select Update List for Product
var SelectUpdateListProducts = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (productTypesTM) {
      return (
        <option
          key={productTypesTM.dbproductid}
          value={productTypesTM.dbproductid}
        >
          {productTypesTM.dbproductname}
        </option>
      );
    });
    return (
      <select name="upProductTypeTM" id="upProductTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select Update List for Status
var SelectUpdateListStatus = React.createClass({
  render: function () {
    return (
      <select name="upStatusTypeTM" id="upStatusTypeTM">
        <option></option>
        <option value="Complete">Complete</option>
        <option value="Back-Order">Back-Order</option>
        <option value="Shipping">Shipping</option>
        <option value="Processing">Processing</option>
      </select>
    );
  },
});

ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
