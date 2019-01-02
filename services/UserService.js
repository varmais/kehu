const Kehu = require("../models/Kehu");
const User = require("../models/User");
const logger = require("../logger");
const Auth0 = require("../utils/Auth0Client");
const { raw } = require("objection");

async function findUserByAuth0Id(auth0_id) {
  try {
    logger.info("Finding user with auth0_id", auth0_id);
    return await User.query()
      .where("auth0_id", auth0_id)
      .first();
  } catch (error) {
    logger.error(error.message);
  }
}

async function findUserByEmail(email) {
  try {
    logger.info("Finding user with email", email);
    let user = await User.query()
      .where("email", email)
      .first();
    if (user) {
      return user;
    }
    const { owner_id } = await Kehu.query()
      .select("owner_id")
      .where("receiver_email", email)
      .andWhere(raw("owner_id IS NOT NULL"))
      .first();
    if (owner_id) {
      return await User.query()
        .where("id", owner_id)
        .first();
    }
  } catch (error) {
    logger.error(error.message);
  }
}

async function getContacts(user_id) {
  return await Kehu.query()
    .select("receiver_name as name", "receiver_email as email")
    .where(function() {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function() {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    })
    .groupBy("name", "email");
}

function isAuth0RegisteredUser(user) {
  const prefix = user.user_id.split("|")[0];
  return prefix === "auth0";
}

function parseUser(user) {
  return {
    first_name: isAuth0RegisteredUser(user)
      ? user.user_metadata.first_name
      : user.given_name,
    last_name: isAuth0RegisteredUser(user)
      ? user.user_metadata.last_name
      : user.family_name,
    auth0_id: user.user_id,
    email: user.email || "",
    picture: user.picture_large ? user.picture_large : user.picture
  };
}

async function createUserFromAuth0(user) {
  try {
    const auth0User = await Auth0.getUser({ id: user.id });
    logger.info("Creating new user");
    return await User.query().insert(parseUser(auth0User));
  } catch (error) {
    logger.error(error.stack);
  }
}

module.exports = {
  findUserByAuth0Id,
  findUserByEmail,
  createUserFromAuth0,
  getContacts
};
