import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  toggleAddKehuFormModal,
  toggleSendKehuFormModal
} from "./redux/portal";
import WelcomePanel from "./components/home/WelcomePanel";
import FeedPanel from "./components/home/FeedPanel";
import { capitalizeText } from "./util/TextUtil";

export class HomePanel extends Component {
  static propTypes = {
    history: PropTypes.shape({
      location: PropTypes.shape({
        search: PropTypes.string
      }).isRequired,
      replace: PropTypes.func.isRequired
    }).isRequired,
    feedItems: PropTypes.array.isRequired,
    hasKehus: PropTypes.bool.isRequired,
    tags: PropTypes.array.isRequired,
    toggleAddKehuFormModal: PropTypes.func.isRequired,
    toggleSendKehuFormModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.checkAndOpenModal();
  }

  render() {
    return (
      <div className="Home home-nw">
        <div className="container">
          <div className="row">
            <div className="col col-xs-12 col-md-9">
              <div className="row HomeButtons">
                <div className="col col-xs-12 col-md-8">
                  <h1 className="HomeButtons-title">Lisää uusi Kehu</h1>
                  <p className="HomeButtons-text">
                    Älä pidä kehujasi vakan alla! Tallenna Kehu-pankkiisi
                    kuulemasi kehu tai pristä kollegaa lähettämällä Kehu!
                  </p>
                </div>
                <div className="col col-xs-12 col-md-4">
                  <div className="HomeButtons-buttons">
                    <button
                      className="Button add-kehu-nw"
                      onClick={this.props.toggleAddKehuFormModal}
                    >
                      Lisää Kehu
                    </button>
                    <button
                      className="Button send-kehu-nw"
                      onClick={this.props.toggleSendKehuFormModal}
                    >
                      Lähetä Kehu
                    </button>
                  </div>
                </div>
              </div>
              {this.renderMainContent()}
            </div>
            <div className="col col-xs-12 col-md-3">
              {this.renderTagsElement()}
              {this.renderBlogElement()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMainContent() {
    if (this.props.hasKehus) {
      return <FeedPanel items={this.props.feedItems} />;
    }
    return <WelcomePanel />;
  }

  renderTagsElement() {
    return (
      <div className="SidebarElement">
        <h3 className="SidebarElement-title">Kehutuimmat taitosi</h3>
        {this.renderTagsContent()}
        <Link to="/raportit" className="Button Button--fullWidth">
          Tarkastele raporttiasi
        </Link>
      </div>
    );
  }

  renderTagsContent() {
    if (this.props.tags.length) {
      return (
        <ul className="SidebarElement-list">
          {this.props.tags.map((tag, i) => (
            <li key={i}>
              {i + 1}. {capitalizeText(tag.text)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <Fragment>
          <p className="SidebarElement-text tags-text-js">
            Jokaiseen kehuun liitetään siihen liittyvät taidot tageina. Kun
            kehudataa alkaa kertyä, voit tarkastella mm. kehutuimpia taitojasi
            Kehu-raportistasi.
          </p>
          <p className="SidebarElement-text">
            Kehu ei ole sosiaalinen media, eli raporttisi ja kaikki tallentamasi
            kehut näkyvät vain sinulle.
          </p>
        </Fragment>
      );
    }
  }

  renderBlogElement() {
    return (
      <div className="SidebarElement">
        <h3 className="SidebarElement-title">
          Omien vahvuuksien tunteminen on ehdoton valttikortti uralla
        </h3>
        <p className="SidebarElement-text">
          Lähetä kehu kollegalle, ystävälle, esimiehelle, asiakkaalle tai
          kenelle tahansa. Tarvitset vastaanottajan sähköpostiosoitteen.
        </p>
        <img
          src="/images/landing-section-6-image.png"
          alt="Blogi"
          className="SidebarElement-image"
        />
        <a href="/blogi" className="Button Button--fullWidth">
          Lue lisää blogista!
        </a>
      </div>
    );
  }

  checkAndOpenModal() {
    const params = new URLSearchParams(this.props.history.location.search);
    if (params.has("q")) {
      if (params.get("q") === "lisaa") {
        this.props.toggleAddKehuFormModal();
      }
      if (params.get("q") === "laheta") {
        this.props.toggleSendKehuFormModal();
      }
      this.props.history.replace("/");
    }
  }
}

const mapStateToProps = state => ({
  feedItems: state.profile.feedItems,
  hasKehus: state.report.numberOfKehus > 0,
  tags: state.report.tags.slice(0, 5)
});

const mapActionsToProps = {
  toggleAddKehuFormModal,
  toggleSendKehuFormModal
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(HomePanel);
