// Create Inventory box for Inventory
var InventoryBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadInventoryFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getInventory",
      data: {
        productNameTM: productNameTM.value,
        inventoryQuantityTM: inventoryQuantityTM.value,
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
  // Check to see if the Inventory is loaded
  componentDidMount: function () {
    this.loadInventoryFromServer();
  },

  // Render the InventoryBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Inventory</h1>
        {/* Get InventorySelectForm to put in Box */}
        <InventorySelectForm onInventorySubmit={this.loadInventoryFromServer} />
        <br />
        {/* Set Table to show Information */}
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity left</th>
            </tr>
          </thead>
          {/* Show list of Inventory */}
          <InventoryList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var InventorySelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      prodDataTM: [],
      inventoryQuantityTM: "",
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
    var productNameTM = productTypeTM.value;
    var inventoryQuantityTM = this.state.inventoryQuantityTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onInventorySubmit({
      productNameTM: productNameTM,
      inventoryQuantityTM: inventoryQuantityTM,
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
        <h2>View Inventory</h2>
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
              {/* Create Product Remaining Input */}
              <th>Inventory Quantity</th>
              <td>
                <input
                  name="inventoryQuantityTM"
                  id="inventoryQuantityTM"
                  value={this.state.inventoryQuantityTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Inventory" />
      </form>
    );
  },
});

// Place Items from Database to table
var InventoryList = React.createClass({
  render: function () {
    var inventoryNodes = this.props.data.map(function (inventoryTM) {
      //map the data to individual donations
      return (
        <Inventory
          key={inventory.dbproductid}
          prodNameTM={inventory.dbproductname}
          invenRemainingTM={inventory.dbproductdescription}
        ></Inventory>
      );
    });

    //print all the nodes in the list
    return <tbody>{inventoryNodes}</tbody>;
  },
});

var Inventory = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.dbproductname}</td>
        <td>{this.props.dbproductdescription}</td>
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

ReactDOM.render(<InventoryBox />, document.getElementById("content"));
