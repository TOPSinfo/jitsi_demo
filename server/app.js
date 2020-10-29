const app = require('express')();
const https = require('https');
const fs = require('fs');
const options = {
    cert : fs.readFileSync('/etc/letsencrypt/live/webrtc.topsdemo.in/cert.pem'),
    key : fs.readFileSync('/etc/letsencrypt/live/webrtc.topsdemo.in/privkey.pem')
}
const server = https.createServer(options,app);
// const server = https.createServer(app);

const io = require('socket.io')(server);


let users = {};
let frontUser = {};
let oldSocketName = '';

io.sockets.on('connection', (socket) => {
    console.log('====================================================================')
    console.log('----->>  User Connected  <<-----');
    console.log('socket.id :: ', socket.id)
    if (oldSocketName) {
        createNewSocket();
    }
    function createNewSocket() {
        socket.nickname = oldSocketName;
        users[socket.id] = { socket };
        users[socket.id]['isAvailable'] = true;
        users[socket.id]['isRejected'] = false;
        oldSocketName = '';
    }
    // var total = io.engine.clients;
    // console.log('Total..:: ', total)
    // To Get Connected users with socket
    getOnlineUsers();
    function getOnlineUsers() {
        let clients = io.engine.clients;
        // console.log('Clients -->>>::', clients)
        let sockets = Object.values(clients);
        // console.log('sockets -->>>::', sockets)
        let socketIds = Object.keys(clients);
        console.log('SocketsId :: ', socketIds);
        return { sockets, socketIds };
    };

    // console.log('Users :: ', users);
    // Admin login users add in users list
    socket.on('new-admin-user', name => {
        // console.log('New Admin User :: ', name);
        socket.nickname = name;
        users[socket.id] = { socket };           // Save socket by user login
        users[socket.id]['isAvailable'] = true;  // Set Admin available property
        users[socket.id]['isRejected'] = false;
        console.log('New Admin users :: ', users);
    });
    // Make connection on connect button click
    socket.on('req_to_connect', req_connect_data => {
        // console.log('Req to Connect :: ', req_connect_data);
        socket.nickname = req_connect_data.connectId;   // Front screen connection id. (Random number)
        frontUser[socket.nickname] = { socket };

        sendAdminUserNotification(req_connect_data);
    });
    // Send notification on connect button click.(Which users are online or avaialble on users list.)
    const sendAdminUserNotification = (data) => {
        console.log('FrontId ---->>', data.connectId);
        // console.log('usersList :: ', users);
        let userNames = Object.keys(users);
        console.log('Users names :: ----', userNames);
        if (userNames.length) {
            let isUserAvailable = false;
            let isCallOnHold = false;
            for (const name in users) {
                if (users[name]['isAvailable']) {
                    isUserAvailable = true;
                    if (!users[name]['isHolded']) {
                        setTimeout(() => {
                            users[name]['isHolded'] = true;
                            users[name]['socket'].emit('send_admin_notification', { msg: 'Connection Success msg', adminId: name, frontId: data.connectId, frontUserInfo: data });
                        }, 0);
                    } else {
                        isCallOnHold = true;
                    }
                }
            }
            if (isCallOnHold) {
                frontUser[data.connectId]['socket'].emit('front_return_link', { OnHold: true, url: '', frontId: data.connectId });
            }
            if (!isUserAvailable) {
                frontUser[data.connectId]['socket'].emit('front_return_link', { msg: 'Users are busy at moment. Please try again later...!!', url: '', frontId: data.connectId });
            }
        } else {
            frontUser[data.connectId]['socket'].emit('front_return_link', { msg: 'No one is available at the moment. Please try after sometime....!!', url: '', frontId: data.connectId });
        }
    }
    // Admin accept connection request
    socket.on('accept_connection', data => {
        // console.log('Accept Connection  :: ', data);
        users[data.adminId]['isAvailable'] = false;
        frontUser[data.frontId]['socket'].emit('front_return_link', { msg: 'Hello Test', url: data.link, frontId: data.frontId, adminName: data.adminUserName });

        removeAdminUserNotification()
    })
    // After accept any one admin request close all popup
    const removeAdminUserNotification = () => {
        for (const name in users) {
            setTimeout(() => {
                users[name]['isHolded'] = false;
                users[name]['socket'].emit('acceptFlag', {});
            }, 0);
        }
    }
    // Disconnect call after video conference is over.
    socket.on('disconnect_user_admin', data => {
        console.log('--->>> %j', data);

        users[data.adminId]['isAvailable'] = true;
        frontUser[data.frontId]['socket'].emit('disconnect_user', {
            msg: 'User Disconnected',
            frontId: data.frontId,
            frontUserName: data.frontUserInfo.fullname,
            subject: data.frontUserInfo.subject,
            adminId: data.adminId,
            adminUserId: data.adminUserId
        });
        // console.log('After disconnect Users :: ', users);
    })

    socket.on('disconnect', () => {
        // socket.removeAllListeners();
        if (users[socket.id]) {
            oldSocketName = users[socket.id].socket.nickname;
            delete users[socket.id];
        }
        console.log('Disconnected User :: ', socket.id);
    });

    // Logout admin user disconnect from socket and user list.
    socket.on('logout_admin_user', (data) => {
        console.log('Disconnect Socket :: ', socket.id)
        socket.on('disconnect', () => {
            console.log('User disconnected. Socket id %s', socket.id);
        })
        delete users[socket.id];
        console.log('users :: ', users)
    });

    console.log('users :: ', users)

    socket.on('reject_call_request', data => {
        console.log('on rejct Reqeust :: ', data);
        users[data.adminId]['isRejected'] = true;
        let userObjs = Object.keys(users);
        if (userObjs.length) {
            let isAllRejected = true;
            for (let i = 0; i < userObjs.length; i++) {
                if (!users[userObjs[i]]['isRejected']) {
                    isAllRejected = false;
                }
                console.log('------>> ', users[userObjs[i]])
            }

            if (isAllRejected) {
                // socket.emit('all_admin_reject_request', data);
                frontUser[data.frontId]['socket'].emit('all_admin_reject_request', {
                    msg: 'All Admins are busy at moment please try again later...!'
                });
            } else {
                console.log('Users available still...!!')
            }
        }
    });
});

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const expressJwt = require('express-jwt');
// const redis = require('redis')
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// const redisClient = redis.createClient();

const appConfig = require('./config/appConfig');
const appRouter = require('./route/appRoute');
const sequelize = require('./utils/databaseConfig');
const { type } = require('jquery');
const baseUrl = appConfig.apiVersion + '/jitsiApp';
// const config = require('./config/config.json').development;

app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors());
// console.log('baseUrl :: ', baseUrl);

// if (process.env.NODE_ENV == 'local') {
//     const swaggerJsDoc = require('swagger-jsdoc');
//     const swaggerUI = require('swagger-ui-express');


//     const swaggerOptions = {
//         swaggerDefinition: {
//             info: {
//                 title: 'Video Calling with KIOSK API',
//                 host: "http://localhost:3000/",
//                 basePath: baseUrl
//             }
//         },
//         apis: ['./route/appRoute.js'],
//     }
//     const swaggerSpec = swaggerJsDoc(swaggerOptions);
//     app.use(baseUrl + '/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// }

// app.use(session({
//     store: new RedisStore({ client: redisClient }),
//     resave: false,
//     secret: appConfig.JWT_SECRET,
//     cookie: {
//         // httpOnly: false,
//         // secure: true,
//         maxAge: 1000 * 60 * 60 // Milliseconds (3600000ms -> 60min)
//     }
// }));

appRouter.setAppRouter(app);

server.listen(appConfig.port, () => {
    console.log("Sever started on ::", appConfig.port);
    sequelize.authenticate().then(() => {                                               // sequelize db Connection ...
        console.log('Database Connection has been established Successfully...!!');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
        exitHandler({}, err);
    });
});

process.stdin.resume();
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('exit', exitHandler.bind(null, { cleanup: true }));

async function exitHandler(options, error) {
    console.log('Error :: ', error)
    process.exit(0);
};


