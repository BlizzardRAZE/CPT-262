// Create Profile box for Profile
var ProfileBox = React.createClass({
  getInitialState: function () {
    return {
      loginData: [],
      viewThePageTM: 0,
      playerNameTM: "",
      playerRewardTM: "",
    };
  },

  // Get the Player ID to see if player can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getPlayerLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ loginData: datalog });
        this.setState({ viewThePageTM: this.state.loginData[0].dbplayerId });
        this.setState({
          playerNameTM:
            this.state.loginData[0].dbplayerfirstname +
            " " +
            this.state.loginData[0].dbplayerlastname,
        });
        this.setState({ playerRewardTM: this.state.loginData[0].dbrewardid });
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  componentDidMount: function () {
    this.loadAllowLogin();
  },

  // Render the Profile Box to appear on HTML
  render: function () {
    // Declare Variable 
    let playerRewardNameTM
    // Check the reward status
    switch(this.state.playerRewardTM){
      case 0:
        playerRewardNameTM = "None";
        break;
      case 1:
        playerRewardNameTM = "Diamond";
        break;
      case 2:
        playerRewardNameTM = "Platinum";
        break;
      case 3:
        playerRewardNameTM = "Gold";
        break;
      case 4:
        playerRewardNameTM = "Silver";

    }

    // If Player Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (this.state.viewThePageTM == 0) {
      return (
        <div className="permissionErrorContainer">
          <div className="titleContainer">
            <span>
              Sorry! You are not logged in! <br></br> Please Sign In!
            </span>
          </div>

          <div className="imageContainer">
            <img src="images/No_Access.png" alt="No Access Icon" draggable="false"></img>
          </div>
        </div>
      );
    } else {
      return (
        // Set Class name to main Content box
        <div className="mainContentBox">
          <div className="titleContainer">
            <h1>Player Profile</h1>
          </div>

          {/* Create player card */}
          <div className="playerCard">
            <div className="playerImage">
              <img src="images/person.png" alt="Person Icon" draggable="false"></img>
            </div>
            <div className="playerInformation">
              <div className="fullName">
                Full Name: {this.state.playerNameTM}
              </div>
              <div className="playerReward">
                Reward Status: {playerRewardNameTM}
              </div>
            </div>
          </div>
        </div>
      );
    }
  },
});

// Place items into element Id named content
ReactDOM.render(<ProfileBox />, document.getElementById("content"));
