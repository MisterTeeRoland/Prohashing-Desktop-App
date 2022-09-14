import React from "react";
import "../../assets/css/layout.css";
import "../../assets/css/modal.css";

const ProhashingApiModal = ({ onClose }) => {
  return (
    <div className="modalBackground" onClick={onClose}>
      <div className="modal">
        <div className="modalClose">x</div>
        <div className="modalTitle">Prohashing API Key</div>
        <div>Not sure where to find your API Key?</div>
        <br></br>
        <div className="listItem">
          1. Log into your{" "}
          <a href="https://prohashing.com" target="_blank">
            Prohashing.com
          </a>{" "}
          account.
        </div>
        <div className="listItem">
          2. Click the 3 bars on the top right to open the menu.
        </div>
        <div className="listItem">3. Click "Account".</div>
        <div className="listItem">
          4. In the Security tab, scroll down to the "API Key Settings" area.
        </div>
        <br></br>
        <div>
          If you do not have an existing API key, click "New Key" to generate a
          new API key.
        </div>
        <br></br>
        <div>
          Copy and paste your API key into the field in this app, and then press
          save.
        </div>
      </div>
    </div>
  );
};

export default ProhashingApiModal;
