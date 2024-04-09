// Create Purchase box for Purchase
var PurchaseBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadPurchasesFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getPurchases",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        employeeFNameTM: employeeFNameTM.value,
        employeeLNameTM: employeeLNameTM.value,
        purchaseDateTimeTM: purchaseDateTimeTM.value,
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
  // Check to see if the Purchases is loaded
  componentDidMount: function () {
    this.loadPurchasesFromServer();
  },

  // Render the PurchaseBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Purchases</h1>
        {/* Get PurchaseSelectForm to put in Box */}
        <PurchaseSelectForm onPurchaseSubmit={this.loadPurchasesFromServer} />
        <br />
        {/* Set Table to show Purchase */}
        <table>
          <thead>
            <tr>
              <th>Player First Name</th>
              <th>Player Last Name</th>
              <th>Employee First Name</th>
              <th>Employee Last Name</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          {/* Show list of Purchase */}
          <PurchaseList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var PurchaseSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerDataTM: [],
      employeeDataTM: [],
      playerEAddressTM: "",
      playerPNumberTM: "",
      playerHDateTM: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },

  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayerNames",
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

  // Get Employee Data
  loadEmployeeNames: function () {
    $.ajax({
      url: "/getEmployeeNames",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ employeeDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadPlayerNames();
    this.loadEmployeeNames();

  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var playerFNameTM = playerFNameTypeTM.value;
    var playerLNameTM = playerLNameTypeTM.value;
    var employeeFNameTM = employeeFNameTypeTM.value;
    var employeeLNameTM = employeeLNameTypeTM.value;
    var purchaseDateTimeTM = this.state.purchaseDateTimeTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onPurchasesubmit({
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      employeeFNameTM: employeeFNameTM,
      employeeLNameTM: employeeLNameTM,
      purchaseDateTimeTM: purchaseDateTimeTM,
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
        <h2>View Purchases</h2>
        <table>
          <tbody>
            <tr>
              {/* Create Player Name Select List [Both First and Last] */}
              <th>Select Player First Name</th>
              <td>
                <SelectListPlayerFirstNames data={this.state.playerDataTM} />
              </td>
            </tr>
            <tr>
              {/* Create Player Name Select List [Both First and Last] */}
              <th>Select Player Last Name</th>
              <td>
                <SelectListPlayerLastNames data={this.state.playerDataTM} />
              </td>
            </tr>
            <tr>
              {/* Create Employee Name Select List [Both First and Last] */}
              <th>Select Employee First Name</th>
              <td>
                <SelectListEmployeesFirstNames
                  data={this.state.employeeDataTM}
                />
              </td>
            </tr>
            <tr>
              {/* Create Employee Name Select List [Both First and Last] */}
              <th>Select Employee Last Name</th>
              <td>
                <SelectListEmployeesLastNames
                  data={this.state.employeeDataTM}
                />
              </td>
            </tr>
            <tr>
              {/* Create Purchase Date and Time Input */}
              <th>Purchase Date and Time</th>
              <td>
                <input
                  type="datetime-local"
                  name="purchaseDateTimeTM"
                  id="purchaseDateTimeTM"
                  value={this.state.purchaseDateTimeTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Purchase" />
      </form>
    );
  },
});

// Place Items from Database to table
var PurchaseList = React.createClass({
  render: function () {
    var purchaseNodes = this.props.data.map(function (purchaseTM) {
      //map the data to individual donations
      return (
        <Player
          key={purchaseTM.dbpurchaseid}
          playFNameTM={purchaseTM.dbcustomerfirstname}
          playLNameTM={purchaseTM.dbcustomerlastname}
          empFNameTM={employeeTM.dbemployeefirstname}
          empLNameTM={employeeTM.dbemployeelastname}
          purchDTTM={purchaseTM.dbpurchasedatetime}
        ></Player>
      );
    });

    //print all the nodes in the list
    return <tbody>{purchaseNodes}</tbody>;
  },
});

var Player = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{this.props.empFNameTM}</td>
        <td>{this.props.empLNameTM}</td>
        <td>{this.props.purchDTTM}</td>
      </tr>
    );
  },
});

// Select List for Players
var SelectListPlayerFirstNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option
          key={playerTypesTM.dbcustomerid}
          value={playerTypesTM.dbcustomerid}
        >
          {playerTypesTM.dbcustomerfirstname}
        </option>
      );
    });
    return (
      <select name="playerFNameTypeTM" id="playerFNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Players
var SelectListPlayerLastNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option
          key={playerTypesTM.dbcustomerid}
          value={playerTypesTM.dbcustomerid}
        >
          {playerTypesTM.dbcustomerlastname}
        </option>
      );
    });
    return (
      <select name="playerLNameTypeTM" id="playerLNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Employees
var SelectListEmployeesFirstNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (employeeTypesTM) {
      return (
        <option
          key={employeeTypesTM.dbemployeeid}
          value={employeeTypesTM.dbemployeeid}
        >
          {employeeTypesTM.dbemployeefirstname}
        </option>
      );
    });
    return (
      <select name="employeeFNameTypeTM" id="employeeFNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Employees
var SelectListEmployeesLastNames = React.createClass({
    render: function () {
      var optionNodes = this.props.data.map(function (employeeTypesTM) {
        return (
          <option
            key={employeeTypesTM.dbemployeeid}
            value={employeeTypesTM.dbemployeeid}
          >
            {employeeTypesTM.dbemployeelastname}
          </option>
        );
      });
      return (
        <select name="employeeLNameTypeTM" id="employeeLNameTypeTM">
          <option value="0"></option>
          {optionNodes}
        </select>
      );
    },
  });

ReactDOM.render(<PurchaseBox />, document.getElementById("content"));
