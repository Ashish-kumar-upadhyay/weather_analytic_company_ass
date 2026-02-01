const User = require("./User");
const Favorite = require("./Favorite");
const ApiHit = require("./ApiHit");
const UserLimit = require("./UserLimit");
const AppConfig = require("./AppConfig");

// User has many Favorites
User.hasMany(Favorite, { foreignKey: "user_id", as: "favorites", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User has many ApiHits
User.hasMany(ApiHit, { foreignKey: "user_id", as: "apiHits", onDelete: "CASCADE" });
ApiHit.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User has one UserLimit
User.hasOne(UserLimit, { foreignKey: "user_id", as: "userLimit", onDelete: "CASCADE" });
UserLimit.belongsTo(User, { foreignKey: "user_id", as: "user" });

// UserLimit updated_by references User (admin)
UserLimit.belongsTo(User, { foreignKey: "updated_by", as: "updatedByAdmin" });

// AppConfig updated_by references User (admin)
AppConfig.belongsTo(User, { foreignKey: "updated_by", as: "updatedByAdmin" });

module.exports = {
  User,
  Favorite,
  ApiHit,
  UserLimit,
  AppConfig,
};
