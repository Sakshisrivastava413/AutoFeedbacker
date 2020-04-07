import React from "react";
import { Route } from "react-router-dom";
import App from "../components/App";
import Header from "../header";

class ReactRouter extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Route exact path="/" component={App} />
      </React.Fragment>
    );
  }
}

export default ReactRouter;
