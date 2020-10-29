const Sequelize = require('sequelize');
const sequelize = require('../utils/databaseConfig');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,      // To increment id automatically
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    user_role: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    create_date: Sequelize.DATE,
    update_date: Sequelize.DATE,

}, {
    timestamps: false,
    freezeTableName: true
});

const Call = sequelize.define('call_details', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,// To increment id automatically,
        allowNull: false,
        primaryKey: true
    },
    adminId: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    duration: { type: Sequelize.STRING, allowNull: false },
    subject: { type: Sequelize.STRING, allowNull: false },
    create_date: Sequelize.DATE,
    update_date: Sequelize.DATE,

}, {
    timestamps: false,
    freezeTableName: true
});

const Feedback = sequelize.define('user_feedback', {
    id: {
        type: Sequelize.INTEGER,      // To increment id automatically
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: { type: Sequelize.STRING, allowNull: false },
    adminId: { type: Sequelize.STRING, allowNull: false },
    feedback: { type: Sequelize.STRING, allowNull: false },
    // message: { type: Sequelize.STRING, allowNull: false },
    // rating: { type: Sequelize.STRING, allowNull: false },
    // create_date: Sequelize.DATE,
    // update_date: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { User, Feedback, Call };

