import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import cn from "classnames";
import { capitalizeText } from "../../util/TextUtil";

export class KehuItem extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired
  };

  render() {
    const { kehu } = this.props;
    const imageSrc = this.createImageSrc(kehu);
    const classNames = cn({
      FeedItem: true,
      "FeedItem--noImage": !imageSrc
    });
    return (
      <div className={classNames}>
        {this.renderImage(kehu, imageSrc)}
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">{this.createInfo(kehu)}</p>
      </div>
    );
  }

  renderImage(kehu, src) {
    if (src) {
      return <img src={src} className="FeedItem-image" alt={kehu.giver_name} />;
    }
  }

  createImageSrc(kehu) {
    if (kehu.receiver_email && kehu.giver && kehu.giver.picture) {
      return kehu.giver.picture;
    }
    if (kehu.role) {
      return `/images/role-${this.sanitizeRole(kehu.role.id)}.svg`;
    }
  }

  sanitizeRole(id) {
    const { roles } = this.props;
    return roles
      .find(r => r.id === id)
      .role.toLowerCase()
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ /g, "-");
  }

  createInfo(kehu) {
    let text = "";

    if (kehu.receiver_email) {
      text += "Vastaanotettu kehu: ";
    }

    if (kehu.role && kehu.role.role) {
      text += `${kehu.giver_name}, ${kehu.role.role}`;
    } else {
      text += kehu.giver_name;
    }

    if (kehu.tags && kehu.tags.length) {
      text += `. Asiasanat: ${kehu.tags
        .map(t => t.text)
        .map(capitalizeText)
        .join(", ")}`;
    }

    return text;
  }
}

const mapStateToProps = state => ({
  roles: state.profile.roles
});

export default connect(
  mapStateToProps,
  null
)(KehuItem);
