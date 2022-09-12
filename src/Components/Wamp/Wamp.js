import React from "react";

const Wamp = () => {
  var wampConnection = null;
  var wampSession = null;
  var wampUser = "web";
  var wampPassword = "web";

  try {
    // for Node.js
    var autobahn = require("autobahn");
  } catch (e) {
    // for browsers (where AutobahnJS is available globally)
  }

  //If using node.js, the following code resolves an issue where the Electronic Frontier Foundation's free certificates are not trusted.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  function onChallenge(wampSession, method, extra) {
    if (method == "wampcra") {
      return autobahn.auth_cra.sign(wampPassword, extra.challenge);
    }
  }

  function connectionOpen(session, details) {
    console.log("jjj session", session);
    console.log("lll details", details);
    wampSession = session;
    wampSession.subscribe("found_block_updates", onBlockUpdate);
    wampSession
      .call("f_all_miner_updates", [
        "0a7a6fade943f7b6b9e96b4d1516bfcc733b5158af18d1b43aeec7e45a238c02",
      ])
      .then(initialSessionUpdatesReceived);
  }

  function onBlockUpdate(block) {
    //Handle found blocks here.

    console.log("BLOCK", block);
  }

  function initialSessionUpdatesReceived(updates) {
    //Handle the initial miner information here.

    console.log("ppp updates", updates);

    //After handling the initial information, now subscribe to receive future updates.
    wampSession.subscribe(
      "miner_update_diffs_0a7a6fade943f7b6b9e96b4d1516bfcc733b5158af18d1b43aeec7e45a238c02",
      onMinerUpdate
    );
  }

  function onMinerUpdate(update) {
    //Handle live miner updates here.
    console.log("MINER UPDATE", update);
  }

  wampConnection = new autobahn.Connection({
    url: "wss://live.prohashing.com:443/ws",
    realm: "mining",
    authmethods: ["wampcra"],
    authid: wampUser,
    onchallenge: onChallenge,
  });

  try {
    wampConnection.onopen = connectionOpen;
    wampConnection.open();
  } catch (e) {
    console.error(e);
  }

  return <></>;
};

export default Wamp;
