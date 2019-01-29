import React from "react";

export default function Footer() {
  return (
    <div className="Footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <div>
              <img className="Footer-logo" src="/images/kehu-logo.png" />
              <p className="Footer-copyright">© Tradenomiliitto 2018</p>
              <ul className="Footer-links">
                <li>
                  <a className="Footer-link" href="/blogi">
                    Blogi
                  </a>
                </li>
                <li>
                  <a className="Footer-link" href="/rekisteriseloste">
                    Rekisteriseloste
                  </a>
                </li>
                <li>
                  <a
                    className="Footer-link"
                    href="https://www.tral.fi/yhteystiedot/"
                  >
                    Yhteystiedot
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
