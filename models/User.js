const Model = require("objection").Model;
const Kehu = require("./Kehu");

class User extends Model {
  static get tableName() {
    return "Users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["auth0_id", "first_name", "last_name", "email", "picture"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        auth0_id: { type: "string" },
        email: { type: "string" },
        picture: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    return {
      kehus: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Users.id",
          to: "Kehus.owner_id"
        }
      },
      kehus_given: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Users.id",
          to: "Kehus.giver_id"
        }
      }
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = User;
