const Kehu = require("../models/Kehu");
const moment = require("moment");

async function getKehus(user_id) {
  return await Kehu.query().where("owner_id", user_id);
}

async function createKehu(data) {
  return await Kehu.query().insert(parseKehu(data));
}

function parseKehu(data) {
  const {
    date_given,
    giver_id,
    giver_name,
    location,
    owner_id,
    text,
    title
  } = data;
  return {
    date_given: moment(date_given, "D.M.YYYY").format(),
    giver_id: parseInt(giver_id, 10),
    giver_name,
    location,
    owner_id: parseInt(owner_id, 10),
    text,
    title
  };
}

module.exports = {
  getKehus,
  createKehu
};
