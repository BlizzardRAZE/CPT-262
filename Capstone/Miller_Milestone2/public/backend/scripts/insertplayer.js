// Create Player box for Customer
var PlayerBox = React.createClass({
    handlePlayerSubmit: function (player) {
      // Connect to database
      $.ajax({
        url: "/newPlayer",
        dataType: "json",
        type: "POST",
        data: player,
        success: function (data) {
          //We set the state again after submission, to update with the submitted data
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
  
    // Render the PlayerBox to appear on HTML
    render: function () {
      return (
        // Set Class name to main Content box
        <div className="mainContentBox">
          <h1>Insert Player</h1>
          {/* Get PlayerInsertForm to put in Box */}
          <PlayerInsertForm onNewPlayerSubmit={this.handlePlayerSubmit} />
        </div>
      );
    },
  });
  
  // Create Form for page
  var PlayerInsertForm = React.createClass({
    // Create Variables and their Initial State
    getInitialState: function () {
      return {
        playerFNameTM: "",
        playerLNameTM: "",
        playerEAddressTM: "",
        playerPNumberTM: "",
      };
    },
  
    handleSubmit: function (e) {
      //We don't want the form to submit, so we prevent the default behavior
      e.preventDefault();
  
      // Get the values from the input fields
      var playerFNameTM = this.state.playerFNameTM.trim();
      var playerLNameTM = this.state.playerLNameTM.trim();
      var playerEAddressTM = this.state.playerEAddressTM.trim();
      var playerPNumberTM = this.state.playerPNumberTM.trim();
  
      // Validate the Players First and Last Names
      if (playerFNameTM.length < 3) {
        // Show Error to User
        window.alert(
          "Please Enter a First Name that is Larger than three Characters."
        );
        return;
      }
  
      if (playerLNameTM.length < 3) {
        // Show Error to User
        window.alert(
          "Please Enter a Last Name that is Larger than three Characters."
        );
        return;
      }
  
      // Validate the players Email Address
      if (!this.validateEmail(playerEAddressTM)) {
        // console.log("Bad Email Address => " + this.validateEmail(playerEAddressTM));
        // Show Error to User
        window.alert(
          "Please Enter a Valid Email address.\nExample:  John@email.com"
        );
        return;
      }
  
      // Validate Phone Number
      if (!this.phoneNumberValidate(playerPNumberTM)) {
        // Show Error to User
        window.alert(
          "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
        );
        return;
      }
  
      if (
        !playerFNameTM ||
        !playerLNameTM ||
        !playerEAddressTM ||
        !playerPNumberTM 
      ) {
        // console.log("Field Missing");
        return;
      }
  
      // Use Values in Text boxes to submit to database
      this.props.onNewPlayerSubmit({
        playerFNameTM: playerFNameTM,
        playerLNameTM: playerLNameTM,
        playerEAddressTM: playerEAddressTM,
        playerPNumberTM: playerPNumberTM,
      });
  
      // Show Message to User when Player is Inserted
      window.alert("Player Added!");
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
          <h2>Insert a New Player</h2>
          {/* Create Table to Hold New Player Information */}
          <table>
            <tbody>
              <tr>
                {/* Create Player First Name Input */}
                <th>Player's First Name</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.playerFNameTM}
                    uniqueName="playerFNameTM"
                    placeholder="John"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerFNameTM")}
                    errorMessage="Player's First Name is Invalid!"
                    emptyMessage="Player's First Name is Required!"
                  />
                </td>
              </tr>
              {/* Create Player Last Name Input */}
              <tr>
                <th>Player's Last Name</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.playerLNameTM}
                    placeholder="Doe"
                    uniqueName="playerLNameTM"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerLNameTM")}
                    errorMessage="Player's Last Name is Invalid!"
                    emptyMessage="Player's Last Name is Required!"
                  />
                </td>
              </tr>
              {/* Create Player Email Input */}
              <tr>
                <th>Player's E-Mail</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.playerEAddressTM}
                    uniqueName="playerEAddressTM"
                    textArea={false}
                    required={true}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, "playerEAddressTM")}
                    errorMessage="Email Address is Invalid!"
                    emptyMessage="Email Address is Required!"
                  />
                </td>
              </tr>
              {/* Create Player Phone Number */}
              <tr>
                <th>Player's Phone Number</th>
                <td>
                  <TextInput
                    value={this.state.playerPNumberTM}
                    uniqueName="playerPNumberTM"
                    textArea={false}
                    required={true}
                    minCharacters={14}
                    maxCharacters={14}
                    validate={this.phoneNumberValidate}
                    onChange={this.setValue.bind(this, "playerPNumberTM")}
                    errorMessage="Phone Number is Invalid!"
                    emptyMessage="Phone Number is Required!"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* Show Submit Button to Submit the form */}
          <input type="submit" value="Insert Player" />
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
  
  // Place items into element Id named content
  ReactDOM.render(<PlayerBox />, document.getElementById("content"));
  