const Sequelize = require('sequelize');
const appConfig = require('../config/appConfig');
const sequelize = new Sequelize(
    // "username": "root",
    // "password": null,
    // "database": "jisti_demo_db",
    'jitsi_demo_db',
    'root',
    'tops?123',
    {
        host: "localhost",
        dialect: "mysql"
    })
// .authenticate()
// .then(() => {
//     console.log('Connection has been established successfully.');
// })
// .catch(err => {
//     console.error('Unable to connect to the database:', err);
// });

module.exports = sequelize;