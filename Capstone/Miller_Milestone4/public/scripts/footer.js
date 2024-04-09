var ShowFooterTM = React.createClass({
  render: function () {
    return (
      <div className="footerJS">
        {/* Show Logo */}
        <div className="footerLogo">
          <img
            draggable="false"
            src="images/Pinehills_logo.png"
            alt="Pinehills Logo Transparent"
          />
        </div>
        {/* Create Nav at bottom of page*/}
        <div className="navContainerFooter">
          <nav>
            <a href="index.html">Home</a>
            <a href="searchproducts.html">View Our Products</a>
            <a href="insertreservation.html">Schedule a Reservation</a>
            <a href="searchreservation.html">Search a Reservation</a>
            <a href="backend/index.html">User Portal</a>
          </nav>
        </div>
        {/* Create Container to hold contact information */}
        <div className="contactContainer">
          {/* Show Address */}
          <div className="addressContainer">
            <span className="footerTitle">Address</span>
            <a href="https://maps.app.goo.gl/Dcv3QD1MtzY7EjV18">
              <span className="footerContent">
                1500 48th Avenue North, <br />
                Myrtle Beach, South Carolina 29577
              </span>
            </a>
          </div>
          {/* Show Phone Number */}
          <div className="phoneContainer">
            <span className="footerTitle">Phone Number</span>
            <a href="tel:+18558259873">
              <span className="footerContent">(855)-825-9873</span>
            </a>
          </div>
        </div>
        {/* Create Container to hold social media icons*/}
        <div className="socialMediaContainer">
          <div className="socialMediaIcon">
            <a target="_blank" href="https://www.facebook.com/myrtlewoodgolf/">
              <img
                draggable="false"
                src="images/icons8-fb-250.png"
                alt="FaceBook Icon"
              />
            </a>
          </div>
          <div className="socialMediaIcon">
            <a
              target="_blank"
              href="mailto:
          myrtlewoodgolf@gmail.com"
            >
              <img
                draggable="false"
                src="images/icons8-gmail-256.png"
                alt="GMail Icon"
              />
            </a>
          </div>
          <div className="socialMediaIcon">
            <a target="_blank" href="https://www.youtube.com/c/Mbngolf">
              <img
                draggable="false"
                src="images/icons8-youtube-512.png"
                alt="Youtube Icon"
              />
            </a>
          </div>
        </div>
        {/* Show Search Bar */}
        <div className="searchContainer">
          <div className="searchBox">
            {/* Show Image */}
            <img
              src="images/icons8-search-192.png"
              alt="Magnify Glass"
              draggable="false"
            ></img>
            {/* Show Input to search */}
            <input type="text" placeholder="Search"></input>
          </div>
          <div className="courseLogo">
            {/* Show Course */}
            <img
              src="images/Mask_Group_19.png"
              alt="PineHills Name"
              draggable="false"
            ></img>
          </div>
        </div>
      </div>
    );
  },
});

// Render the footer in the element
ReactDOM.render(<ShowFooterTM />, document.getElementById("footer"));
