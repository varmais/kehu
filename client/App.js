import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";
import store from "./redux";
import Home from "./Home";
import Header from "./components/Header";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import AddKehuForm from "./components/AddKehuForm";
import AddKehuSuccessPanel from "./components/kehuform/AddKehuSuccessPanel";
import { getProfile } from "./redux/user";

class App extends Component {
  static propTypes = {
    isPortalVisible: PropTypes.bool.isRequired,
    successfullyAddedKehu: PropTypes.object,
    getProfile: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getProfile();
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Header />
          <Home />
          {this.renderPortal()}
        </div>
      </Provider>
    );
  }

  renderPortal() {
    if (this.props.isPortalVisible) {
      return <Portal>{this.renderAddKehuForm()}</Portal>;
    }
  }

  renderAddKehuForm() {
    if (this.props.successfullyAddedKehu) {
      return (
        <KehuFormModal title="Kehu lisätty!">
          <AddKehuSuccessPanel kehu={this.props.successfullyAddedKehu} />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title="Lisää Kehu">
        <AddKehuForm />
      </KehuFormModal>
    );
  }
}

const mapStateToProps = state => ({
  isPortalVisible: state.portal.isVisible,
  successfullyAddedKehu: state.kehu.addedKehu
});

const mapDispatchToProps = {
  getProfile
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const HotApp = hot(module)(AppContainer);

export default () => (
  <Provider store={store}>
    <HotApp />
  </Provider>
);
