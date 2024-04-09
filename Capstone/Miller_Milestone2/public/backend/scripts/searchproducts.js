// Create Product box for Products
var ProductBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadProductsFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getProduct",
      data: {
        productNameTM: productNameTM.value,
        productDescriptionTM: productDescriptionTM.value,
        productPriceTM: productPriceTM.value,
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
  // Check to see if the Products is loaded
  componentDidMount: function () {
    this.loadProductsFromServer();
  },

  // Render the ProductBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Products</h1>
        {/* Get ProductSelectForm to put in Box */}
        <ProductSelectForm onProductSubmit={this.loadProductsFromServer} />
        <br />
        {/* Set Table to show Information */}
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          {/* Show list of Products */}
          <ProductList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var ProductSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      prodDataTM: [],
      productDescriptionTM: "",
      productPriceTM: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
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
    var productNameTM = this.state.productTypeTM.trim();
    var productDescriptionTM = this.state.productDescriptionTM.trim();
    var productPriceTM = this.state.productPriceTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onProductSubmit({
      productNameTM: productNameTM,
      productDescriptionTM: productDescriptionTM,
      productPriceTM: productPriceTM,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render the form
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>View Products</h2>
        <table>
          <tbody>
            <tr>
              {/* Create Product Name Select List */}
              <th>Select Product</th>
              <td>
                <SelectListProductNames
                  data={this.state.prodDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            <tr>
              {/* Create Product Description Input */}
              <th>Product Description</th>
              <td>
                <input
                  name="productDescriptionTM"
                  id="productDescriptionTM"
                  value={this.state.productDescriptionTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              {/* Create Product Price Input */}
              <th>Product Price</th>
              <td>
                <input
                  name="productPriceTM"
                  id="productPriceTM"
                  value={this.state.productPriceTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Product" />
      </form>
    );
  },
});

// Place Items from Database to table
var ProductList = React.createClass({
  render: function () {
    var productNodes = this.props.data.map(function (productTM) {
      //map the data to individual donations
      return (
        <Product
          key={productTM.dbproductid}
          prodNameTM={productTM.dbproductname}
          prodDescriptionTM={productTM.dbproductdescription}
          prodPriceTM={productTM.dbproductprice}
        ></Product>
      );
    });

    //print all the nodes in the list
    return <tbody>{productNodes}</tbody>;
  },
});

var Product = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.prodNameTM}</td>
        <td>{this.props.prodDescriptionTM}</td>
        <td>{this.props.prodPriceTM}</td>
      </tr>
    );
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

ReactDOM.render(<ProductBox />, document.getElementById("content"));
