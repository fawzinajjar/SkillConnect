import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import getCurrentProfile from './'

function Dashboard(props) {
  return <div>Dashboard</div>;
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = {
  getCurrentProfile: 
}

export default connect(mapStateToProps,{})(Dashboard);
