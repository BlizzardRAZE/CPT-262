// Create Product box for New Product
var ProductBox = React.createClass({
    handleProductSubmit: function (product) {
      // Connect to database 
      $.ajax({
        url: "/newProduct",
        dataType: "json",
        type: "POST",
        data: product,
        success: function (data) {
          //We set the state again after submission, to update with the submitted data
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
  
    // Render the Product to appear on HTML
    render: function () {
      return (
        // Set Class name to main Content box
        <div className="mainContentBox">
          <h1>Insert Product</h1>
          {/* Get ProductInsertForm to put in Box */}
          <ProductInsertForm
            onNewProductSubmit={this.handleProductSubmit}
          />
        </div>
      );
    },
  });
  
  // Create Form for page
  var ProductInsertForm = React.createClass({
    // Create Variables and their Initial State
    getInitialState: function () {
      return {
        productNameTM: "",
        productDescriptionTM: "",
        productPriceTM: "",
        productQuantityTM: "",
      };
    },
  
    handleSubmit: function (e) {
      //We don't want the form to submit, so we prevent the default behavior
      e.preventDefault();
  
      // Get the values from the input fields
      var productNameTM = this.state.productNameTM.trim();
      var productDescriptionTM = this.state.productDescriptionTM.trim();
      var productPriceTM = this.state.productPriceTM.trim();
      var productQuantityTM = this.state.productQuantityTM.trim();
  
      // Validate the Product Name
      if (productNameTM.length === 0) {
        // Show Error to User
        window.alert(
          "Please Enter a Product Name."
        );
        return;
      }
  
      // Validate the Product's Description
      if (productDescriptionTM.length === 0) {
        // Show Error to User
        window.alert(
          "Please Enter a Description about the Product."
        );
        return;
      }
  
      // Validate the Product Price
      if (isNaN(productPriceTM) || productPriceTM.length === 0 || productPriceTM <= 0 || productPriceTM > 9999.99) {
        // Show Error to User
        window.alert("Please Enter a Valid Price for Product\nMake sure it is in the Range of $0 and $9,999.\nEx: 5000.00");
        return;
      }

      // Validate the Product Quantity
      if (isNaN(productQuantityTM) || productQuantityTM.length === 0 || productQuantityTM <= 0 || productQuantityTM > 99999) {
        // Show Error to User
        window.alert("Please Enter a Valid Quantity Number for Product\nMake sure it is in the Range of 0 and 99,999 Units.\nEx: 5000");
        return;
      }
  
      if (!productNameTM || !productDescriptionTM || !productPriceTM || !productQuantityTM) {
        // console.log("Field Missing");
        return;
      }
  
      // Use Values in Text boxes to submit to database
      this.props.onNewProductSubmit({
        productNameTM: productNameTM,
        productDescriptionTM: productDescriptionTM,
        productPriceTM: productPriceTM,
        productQuantityTM: productQuantityTM
      });
  
      // Show Message to User when Product is Inserted
      window.alert("Product Added!");
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
          <h2>Insert a New Product</h2>
          {/* Create Table to Hold New Product Information */}
          <table>
            <tbody>
              <tr>
                {/* Create Product Name Input */}
                <th>Product Name</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.productNameTM}
                    uniqueName="productNameTM"
                    textArea={false}
                    required={true}
                    minCharacters={2}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "productNameTM")}
                    errorMessage="Product Name is Invalid!"
                    emptyMessage="Product Name is Required!"
                  />
                </td>
              </tr>
              {/* Create Product Description Input */}
              <tr>
                <th>Product Description</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.productDescriptionTM}
                    placeholder="Doe"
                    uniqueName="productDescriptionTM"
                    textArea={true}
                    required={true}
                    minCharacters={2}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "productDescriptionTM")}
                    errorMessage="Product Description is Invalid!"
                    emptyMessage="Product Description is Required!"
                  />
                </td>
              </tr>
              {/* Create Product Price Input */}
              <tr>
                <th>Product Price</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.productPriceTM}
                    uniqueName="productPriceTM"
                    textArea={false}
                    required={true}
                    validate={this.validateDollars}
                    minCharacters={2}
                    maxCharacters={8}
                    onChange={this.setValue.bind(this, "productPriceTM")}
                    errorMessage="Product Price is Invalid!"
                    emptyMessage="Product Price is Required!"
                  />
                </td>
              </tr>
              {/* Create Product Quantity */}
              <tr>
                <th>Product Quantity</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.productQuantityTM}
                    uniqueName="productQuantityTM"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    minCharacters={1}
                    maxCharacters={5}
                    onChange={this.setValue.bind(this, "productQuantityTM")}
                    errorMessage="Product Quantity is Invalid!"
                    emptyMessage="Product Quantity is Required!"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* Show Submit Button to Submit the form */}
          <input type="submit" value="Insert Product"  id="buttonSubmit"/>
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
  
  
  // Place items into element Id named content
  ReactDOM.render(<ProductBox />, document.getElementById("content"));
  