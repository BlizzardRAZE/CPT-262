// Create Purchase box for a Sale
var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { loginData: [], viewThePageTM: 0 };
  },
  handlePurchaseSubmit: function (purchase) {
    // Connect to database
    $.ajax({
      url: "/newPurchase",
      dataType: "json",
      type: "POST",
      data: purchase,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
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
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadAllowLogin();
  },

  // Render the Purchase to appear on HTML
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
        // Set Class name to main Content box
        <div className="mainContentBox">
          <h1>Insert Purchase</h1>
          {/* Get PurchaseInsertForm to put in Box */}
          <PurchaseInsertForm onNewPurchaseSubmit={this.handlePurchaseSubmit} />
        </div>
      );
    }
  },
});

// Create Form for page
var PurchaseInsertForm = React.createClass({
  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ playerDataTM: data });
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
    this.loadPlayerNames();
    this.loadUsersNames();
    this.loadProductNames();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerDataTM: [],
      userDataTM: [],
      productDataTM: [],
      purchaseQuantityTM: "",
      purchasePriceTotalTM: "",
    };
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var playerNameTM = playerTypeTM.value;
    var userNameTM = userTypeTM.value;
    var productItemTM = productTypeTM.value;
    var statusOfPurchaseTM = statusTypeTM.value;
    var purchaseQuantityTM = this.state.purchaseQuantityTM.trim();
    var purchasePriceTotalTM = this.state.purchasePriceTotalTM.trim();

    // Validate if the user selected an item from player
    if (!this.validateSelectList(playerNameTM)) {
      window.alert("Select a Player.");
      return;
    }

    // Validate if the user selected an item from user
    if (!this.validateSelectList(userNameTM)) {
      window.alert("Select a User.");
      return;
    }

    // Validate if the user selected an item from product
    if (!this.validateSelectList(productItemTM)) {
      window.alert("Select a Product.");
      return;
    }

    // Validate if the user selected an item from Status
    if (!this.validateSelectList(statusOfPurchaseTM)) {
      window.alert(
        "Select the Status of the Purchase.\nIs Order: Complete, Back Ordered, being Shipped, or being Processed?"
      );
      return;
    }
    // Validate the Purchase Quantity
    if (
      isNaN(purchaseQuantityTM) ||
      purchaseQuantityTM.length === 0 ||
      purchaseQuantityTM <= 0 ||
      purchaseQuantityTM > 99999
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Quantity Number for Product Purchased\nMake sure it is in the Range of 0 and 99,999 Units.\nEx: 5000"
      );
      return;
    }

    // Validate the Product Price
    if (
      isNaN(purchasePriceTotalTM) ||
      purchasePriceTotalTM.length === 0 ||
      purchasePriceTotalTM <= 0 ||
      purchasePriceTotalTM > 9999.99
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Price for Product Purchased\nMake sure it is in the Range of $0 and $9,999.\nEx: $5000.00"
      );
      return;
    }

    if (
      !playerNameTM ||
      !userNameTM ||
      !productItemTM ||
      !statusOfPurchaseTM ||
      !purchaseQuantityTM ||
      !purchasePriceTotalTM
    ) {
      //   console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewPurchaseSubmit({
      playerNameTM: playerNameTM,
      userNameTM: userNameTM,
      productItemTM: productItemTM,
      statusOfPurchaseTM: statusOfPurchaseTM,
      purchaseQuantityTM: purchaseQuantityTM,
      purchasePriceTotalTM: purchasePriceTotalTM,
    });

    // Show Message to User when Purchase is Inserted
    window.alert("Purchase Added!");
  },

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    console.log(userSelectedOption);
    if (userSelectedOption === "0") {
      return false;
    } else {
      return true;
    }
  },

  // Regex to Validate Money
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  },

  // Set Common Validate for other Validations
  commonValidate: function () {
    return true;
  },
  // Set the value for variables
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  // Render the form
  render: function () {
    return (
      // Create HTML Form
      <form onSubmit={this.handleSubmit} className="formContainer">
        {/* Create Header */}
        <h2>Insert a New Purchase</h2>
        {/* Create Table to Hold New Purchase Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Player  Select List */}
              <th>Select Player</th>
              <td>
                <SelectListPlayers
                  data={this.state.playerDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
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
            {/* Create Purchase Quantity */}
            <tr>
              <th>Purchase Quantity</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.purchaseQuantityTM}
                  uniqueName="purchaseQuantityTM"
                  textArea={false}
                  required={true}
                  validate={this.commonValidate}
                  minCharacters={1}
                  maxCharacters={5}
                  onChange={this.setValue.bind(this, "purchaseQuantityTM")}
                  errorMessage="Purchase Quantity is Invalid!"
                  emptyMessage="Purchase Quantity is Required!"
                />
              </td>
            </tr>
            {/* Create Purchase Price Input */}
            <tr>
              <th>Purchase Price Total</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.purchasePriceTotalTM}
                  uniqueName="purchasePriceTotalTM"
                  textArea={false}
                  required={true}
                  validate={this.validateDollars}
                  minCharacters={2}
                  maxCharacters={8}
                  onChange={this.setValue.bind(this, "purchasePriceTotalTM")}
                  errorMessage="Purchase Price Total is Invalid!"
                  emptyMessage="Purchase Price Total is Required!"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Purchase" id="buttonSubmit" />
      </form>
    );
  },
});

// Handle Input Error and Configure the styling for Error to Show
var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  // Render the Error
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});

// Create TextInput for inputs that require a Text Box
var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    // Check to see if text box is valid
    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length > this.props.maxCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    // Set value of Text Box to one of the variables
    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  // Render the Textbox
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            type={this.props.inputType}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    }
  },
});

// Create DateInput for inputs that require a Date Box
var DateInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  // Render Date Box
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          type={this.props.inputType}
          name={this.props.uniqueName}
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

// Create TimeInput for inputs that require a Time Box
var TimeInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    // Render the Time Input
    return (
      <div className={this.props.uniqueName}>
        <input
          name={this.props.uniqueName}
          type="time"
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

// Select List for Players
var SelectListPlayers = React.createClass({
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
      <select name="playerTypeTM" id="playerTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Users
var SelectListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option key={userTypesTM.dbuserid} value={userTypesTM.dbuserid}>
          {userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        </option>
      );
    });
    return (
      <select name="userTypeTM" id="userTypeTM">
        <option value="0"></option>
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
        <option value="0"></option>
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
        <option value="0"></option>
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
