'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('Schedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            member_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Members',
                    key: 'id'
                },
            },
            summary: {
                allowNull: false,
                type: Sequelize.STRING
            },
            memo: {
                type: Sequelize.STRING
            },
            guest: {
                type: Sequelize.STRING
            },
            start_date_time: {
                allowNull: false,
                type: Sequelize.DATE
            },
            end_date_time: {
                allowNull: false,
                type: Sequelize.DATE
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        },
        {

                                          });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('Schedules');
    }
};
