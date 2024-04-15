// Create Product box for Product
var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadProductsFromServer: function () {
    // Connect to database
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
  // Check to see if items are loaded from server
  componentDidMount: function () {
    this.loadProductsFromServer();
  },

  // Render the box to HTML
  render: function () {
    return (
      <div>
        <div className="titleContainer">
          <h1>View Products</h1>
        </div>
        {/* Show the form */}
        <ProductForm onProductSubmit={this.loadProductsFromServer} />
        <br />
        {/* Create Table and put data from database into here (Use the List) */}
        <table id="resultData">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Description</th>
              <th>Product Price</th>
              <th>Product Quantity</th>
            </tr>
          </thead>
          <ProductList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var ProductForm = React.createClass({
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
      <form onSubmit={this.handleSubmit} >
        {/* Create Header */}
        <h2>Search a Product</h2>
        {/* Create Div for form */}
        <div className="formContainer">
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
        </div>
      </form>
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
  render: function () {
    //Display info
    return (
      <tr>
        <td>{this.props.productNameTM}</td>
        <td>{this.props.productDescriptionTM}</td>
        <td>{this.props.productPriceTM}</td>
        <td>{this.props.productQuantityTM}</td>
      </tr>
    );
  },
});


// Place items into element Id named content
ReactDOM.render(<ProductBox />, document.getElementById("content"));
