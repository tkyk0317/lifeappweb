'use strict';
module.exports = function(sequelize, DataTypes) {
  var Schedule = sequelize.define('Schedule', {
    member_id: DataTypes.INTEGER,
    summary: DataTypes.STRING,
    memo: DataTypes.STRING,
    guest: DataTypes.STRING,
    location: DataTypes.STRING,
    start_date_time: DataTypes.STRING,
    end_date_time: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Schedule.belongsTo(models.Member, {"foreignKey": "member_id"});
      }
    }
  });
  return Schedule;
};
