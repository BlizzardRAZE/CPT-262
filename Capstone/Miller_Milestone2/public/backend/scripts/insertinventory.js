// Create Inventory box for New Inventory
var PurchaseBox = React.createClass({
  handleInventorySubmit: function (inventory) {
    // Connect to database
    $.ajax({
      url: "/newInventory",
      dataType: "json",
      type: "POST",
      data: inventory,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Render the Inventory to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Insert Inventory</h1>
        {/* Get InventoryInsertForm to put in Box */}
        <InventoryInsertForm
          onNewInventorySubmit={this.handleInventorySubmit}
        />
      </div>
    );
  },
});

// Create Form for page
var InventoryInsertForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      inventoryQuantityTM: "",
      prodDataTM: [],
    };
  },

  // Get Products
  loadProductNames: function () {
    $.ajax({
      url: "/getProductNames",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ prodDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadProductNames();
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var productNameTM = productTypeTM.value;
    var inventoryQuantityTM = this.state.inventoryQuantityTM.trim();

    // Validate if the user selected an item
    if (!this.validateSelectList(productNameTM)) {
      window.alert("Select a Product.");
      return;
    }

    // Validate the Inventory Quantity
    if (
      isNaN(inventoryQuantityTM) ||
      inventoryQuantityTM.length === 0 ||
      inventoryQuantityTM <= 0 ||
      inventoryQuantityTM > 500
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Number for Inventory Quantity.\nMake sure it is in the Range of 0 and 500.\nEx: 40"
      );
      return;
    }

    if (!inventoryQuantityTM || !productNameTM) {
      //   console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewInventorySubmit({
      inventoryQuantityTM: inventoryQuantityTM,
      productNameTM: productNameTM,
    });

    // Show Message to User when Product is Inserted
    window.alert("Inventory Added!");
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
      <form onSubmit={this.handleSubmit}>
        {/* Create Header */}
        <h2>Insert a New Inventory</h2>
        {/* Create Table to Hold New Inventory Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Product Name Select List */}
              <th>Product Name</th>
              <td>
                <SelectListProductNames
                  data={this.state.prodDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            {/* Create Inventory Quantity Input */}
            <tr>
              <th>Inventory Quantity</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.inventoryQuantityTM}
                  placeholder="Doe"
                  uniqueName="inventoryQuantityTM"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  maxCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "inventoryQuantityTM")}
                  errorMessage="Inventory Quantity is Invalid!"
                  emptyMessage="Inventory Quantity  is Required!"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Inventory" />
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

// Select List for Products
var SelectListProductNames = React.createClass({
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

// Place items into element Id named content
ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
