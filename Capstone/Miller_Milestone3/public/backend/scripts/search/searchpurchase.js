// Create Purchase box for Purchase
var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadPurchasesFromServer: function () {
    // Connect to database
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
  // Check to see if items are loaded from server
  componentDidMount: function () {
    this.loadPurchasesFromServer();
  },

  // Render the box to HTML
  render: function () {
    return (
      <div>
        <h1>View Purchases</h1>
        {/* Show the form */}
        <PurchaseForm onPurchaseSubmit={this.loadPurchasesFromServer} />
        <br />
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
            </tr>
          </thead>
          <PurchaseList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var PurchaseForm = React.createClass({
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
      productItemTM:productItemTM,
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
        <input type="submit" value="Search Purchase" id="buttonSubmit"/>
      </form>
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
      </tr>
    );
  },
});

// Select List for Users
var SelectListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option key={userTypesTM.dbuserid} value={userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}>
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
          value={productTypesTM.dbproductname}
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

// Place items into element Id named content
ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
