let appConfig = {};

appConfig.port = 3000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = process.env.NODE_ENV || 'development';
// appConfig.db={
//     uri:'mongodb://127.0.0.1:27017/moodcafe'
// };

// appConfig.db = {
//     //{
//     "development": {
//         "username": "root",
//         "password": null,
//         "database": "jisti_demo_db",
//         "host": "127.0.0.1",
//         "dialect": "mysql"
//     },
//     "test": {
//         "username": "root",
//         "password": null,
//         "database": "database_test",
//         "host": "127.0.0.1",
//         "dialect": "mysql"
//     },
//     "production": {
//         "username": "root",
//         "password": null,
//         "database": "database_production",
//         "host": "127.0.0.1",
//         "dialect": "mysql"
//     }
//     // }

// }





//issueTracker issueTracker

appConfig.apiVersion = '/api/V1';
appConfig.JWT_SECRET = 'Jitsi'

module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db: appConfig.db,
    apiVersion: appConfig.apiVersion,
    JWT_SECRET: appConfig.JWT_SECRET
}