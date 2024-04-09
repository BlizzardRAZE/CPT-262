// Create Product box for Product
var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadProductsFromServer: function () {
    // Connect to database
    // To get data from table
    $.ajax({
      url: "/selectProducts",
      data: {
        productNameTM: productNameTM.value,
        productPriceTM: productPriceTM.value,
        productDescriptionTM: productDescriptionTM.value,
        productQuantityTM: productQuantityTM.value,
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

  updateSingleProductFromServer: function (product) {
    // Connect to database
    // To push new updated data to table
    $.ajax({
      url: "/updateSingleProduct",
      dataType: "json",
      data: product,
      type: "POST",
      cache: false,
      success: function (upSingleProductDataTM) {
        this.setState({ upSingleProductDataTM: upSingleProductDataTM });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },

  componentDidMount: function () {
    this.loadProductsFromServer();
    // setInterval(this.loadProductsFromServer, this.props.pollInterval);
  },

  // Render the box to HTML
  render: function () {
    return (
      <div>
        {/* Show the select form */}
        <h1>Update Product</h1>
        <ProductSelectForm onProductSubmit={this.loadProductsFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            {/* Create Table and put data from database into here (Use the List) */}
            <table id="resultData">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Description</th>
                  <th>Product Price</th>
                  <th>Product Quantity</th>
                  <th></th>
                </tr>
              </thead>
              {/* Show data from database into list */}
              <ProductList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            {/* Show the Update Form */}
            <ProductUpdateForm
              onUpdateSubmit={this.updateSingleProductFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

// Create Form for page
var ProductSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      productNameTM: "",
      productDescriptionTM: "",
      productPriceTM: "",
      productQuantityTM: "",
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
    var productNameTM = this.state.productNameTM.trim();
    var productDescriptionTM = this.state.productDescriptionTM.trim();
    var productPriceTM = this.state.productPriceTM.trim();
    var productQuantityTM = this.state.productQuantityTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onProductSubmit({
      productNameTM: productNameTM,
      productDescriptionTM: productDescriptionTM,
      productPriceTM: productPriceTM,
      productQuantityTM: productQuantityTM,
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
        <h2>Search a Product</h2>
        {/* Create Table to hold form */}
        <table>
          <tbody>
            {/* Display Product Name for Input*/}
            <tr>
              <th>Product's Name</th>
              <td>
                <input
                  type="text"
                  name="productNameTM"
                  id="productNameTM"
                  value={this.state.productNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Product Description for Input */}
            <tr>
              <th>Product's Description</th>
              <td>
                <input
                  type="text"
                  name="productDescriptionTM"
                  id="productDescriptionTM"
                  value={this.state.productDescriptionTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Product's price for Input */}
            <tr>
              <th>Product's Price</th>
              <td>
                <input
                  name="productPriceTM"
                  id="productPriceTM"
                  value={this.state.productPriceTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Product's Quantity for input */}
            <tr>
              <th>Product's Quantity</th>
              <td>
                <input
                  name="productQuantityTM"
                  id="productQuantityTM"
                  value={this.state.productQuantityTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Submit button to Search Product */}
        <input type="submit" value="Search Product" id="buttonSubmit"/>
      </form>
    );
  },
});

// Display Update Form
var ProductUpdateForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      updateProductidTM: "",
      updateProductNameTM: "",
      updateProductDescriptionTM: "",
      updateProductPriceTM: "",
      updateProductQuantityTM: "",
    };
  },

  // Handle the change when the user interacts with Radio button
  handleUpOptionChange: function (e) {
    this.setState({
      upProductSelectedOptionTM: e.target.value,
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var updateProductidTM = upProductidTM.value;
    var updateProductNameTM = upProductNameTM.value;
    var updateProductDescriptionTM = upProductDescriptionTM.value;
    var updateProductPriceTM = upProductPriceTM.value;
    var updateProductQuantityTM = upProductQuantityTM.value;

    // Validate the Product Name
    if (updateProductNameTM.length === 0) {
      // Show Error to User
      window.alert("Please Enter a Product Name.");
      return;
    }

    // Validate the Product's Description
    if (updateProductDescriptionTM.length === 0) {
      // Show Error to User
      window.alert("Please Enter a Description about the Product.");
      return;
    }

    // Validate the Product Price
    if (
      isNaN(updateProductPriceTM) ||
      updateProductPriceTM.length === 0 ||
      productPriceTM <= 0 ||
      updateProductPriceTM > 9999.99
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Price for Product\nMake sure it is in the Range of $0 and $9,999.\nEx: $5000.00"
      );
      return;
    }

    // Validate the Product Quantity
    if (
      isNaN(updateProductQuantityTM) ||
      updateProductQuantityTM.length === 0 ||
      updateProductQuantityTM <= 0 ||
      updateProductQuantityTM > 99999
    ) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Quantity Number for Product\nMake sure it is in the Range of 0 and 99,999 Units.\nEx: 5000"
      );
      return;
    }

    if (
      !updateProductNameTM ||
      !updateProductDescriptionTM ||
      !updateProductPriceTM ||
      !updateProductQuantityTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Show confirm button if user wants to processed with the update
    if (confirm("Are you sure you want to update record?") == true) {
      // Use Values in Text boxes to submit to database
      this.props.onUpdateSubmit({
        updateProductidTM: updateProductidTM,
        updateProductNameTM: updateProductNameTM,
        updateProductDescriptionTM: updateProductDescriptionTM,
        updateProductPriceTM: updateProductPriceTM,
        updateProductQuantityTM: updateProductQuantityTM,
      });

      // Show Message to User when data is updated
      window.alert("Product Updated!");
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
    console.log(userSelectedOption);
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
      test: console.log(event.target.id),
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <h2>Update Product</h2>
            <table>
              <tbody>
                {/* Display Product Name for Input */}
                <tr>
                  <th>Product Name</th>
                  <td>
                    <input
                      type="text"
                      name="upProductNameTM"
                      id="upProductNameTM"
                      value={this.state.upProductNameTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Product Description for Input */}
                <tr>
                  <th>Product Description</th>
                  <td>
                    <textarea
                      type="text"
                      textArea="true"
                      name="upProductDescriptionTM"
                      id="upProductDescriptionTM"
                      value={this.state.upProductDescriptionTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Product Price for Input */}
                <tr>
                  <th>Product Price</th>
                  <td>
                    <input
                      name="upProductPriceTM"
                      id="upProductPriceTM"
                      value={this.state.upProductPriceTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Product Quantity for Input */}
                <tr>
                  <th>Product Quantity</th>
                  <td>
                    <input
                      name="upProductQuantityTM"
                      id="upProductQuantityTM"
                      value={this.state.upProductQuantityTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upProductidTM"
              id="upProductidTM"
              onChange={this.handleUpChange}
            />
            {/* Show Submit Button to Submit the form */}
            <input type="submit" value="Update Product" id="buttonSubmit"/>
          </form>
        </div>
      </div>
    );
  },
});

// Display Product Information
var ProductList = React.createClass({
  // Render in data for database
  render: function () {
    var productNodes = this.props.data.map(function (productTM) {
      //map the data
      return (
        <Product
          key={productTM.dbproductid}
          prodIdTM={productTM.dbproductid}
          productNameTM={productTM.dbproductname}
          productDescriptionTM={productTM.dbproductdescription}
          productPriceTM={productTM.dbproductprice}
          productQuantityTM={productTM.dbproductquantity}
        ></Product>
      );
    });

    //Print all the nodes in the list
    return <tbody>{productNodes}</tbody>;
  },
});

var Product = React.createClass({
  getInitialState: function () {
    return {
      upProductidTM: "",
      singleProdDataTM: [],
    };
  },

  // Get id from text box and pass it to function to populate input fields for update form
  updateRecord: function (e) {
    e.preventDefault();
    var theUpProdidTM = this.props.prodIdTM;

    this.loadSingleProduct(theUpProdidTM);
  },

  loadSingleProduct: function (theUpProdidTM) {
    $.ajax({
      url: "/selectSingleProduct",
      data: {
        upProductidTM: theUpProdidTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singleProdDataTM: data });
        // console.log(this.state.singleProdDataTM);

        // Get values from database and assign them to input fields to show
        var populateProduct = this.state.singleProdDataTM.map(function (product) {
          upProductidTM.value = theUpProdidTM;
          upProductNameTM.value = product.dbproductname;
          upProductDescriptionTM.value = product.dbproductdescription;
          upProductPriceTM.value = product.dbproductprice;
          upProductQuantityTM.value = product.dbproductquantity;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    //Display info
    return (
      <tr>
        <td>{this.props.productNameTM}</td>
        <td>{this.props.productDescriptionTM}</td>
        <td>{this.props.productPriceTM}</td>
        <td>{this.props.productQuantityTM}</td>
        <td>
          <form onSubmit={this.updateRecord} >
            <input type="submit" value="Update Record" id="buttonSubmit"/>
          </form>
        </td>
      </tr>
    );
  },
});

ReactDOM.render(<ProductBox />, document.getElementById("content"));
