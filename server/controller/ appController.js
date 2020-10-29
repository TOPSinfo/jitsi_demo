const jwt = require('jsonwebtoken');
const q = require('q');
const passwordHash = require('password-hash');

const appConfig = require('../config/appConfig');
const response = require('../lib/response');
const Model = require('../model/models');

let sayHello = (req, res) => {
    res.send('Hello Test APP');
}

// add user details
let getAllUserDetails = (req, res) => {
    Model.User.hasMany(Model.Feedback, { foreignKey: 'adminId' })
    Model.User.belongsTo(Model.Feedback, { targetKey: 'adminId', foreignKey: 'id' });

    Model.User.findAll({
        include: [{
            model: Model.Feedback,
        }],
        order: [
            ['name', 'ASC'],
        ]
    }).then(userDetails => {
        let apiResponse = response.setSuccessResponse(200, 'Get Users', userDetails);
        return res.send(apiResponse);
    }).catch((err) => {
        console.error('Get All Users Error :: ', err);
        let apiResponse = response.setFailureResponse(err);
        res.send(apiResponse);
    });
}
let getUserById = (req, res) => {
    Model.User.findAll({
        where: {
            id: req.query.userId
        }
    }).then(userDetail => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Get User Details', userDetail);
        return res.send(apiSuccessResponse);

    }).catch(err => {
        //console.log(err);
        let apiFailureResponse = response.setFailureResponse(err);
        res.send(apiFailureResponse);

    })
}

let createNewUser = (req, res) => {
    let addObj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.role,
        is_active: "1",
        username: req.body.username
    }
    addObj.password = passwordHash.generate(addObj.password);
    Model.User.create(addObj).then(userDetails => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Adding User Details Successfully', userDetails);
        return res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.setFailureResponse(err);
        return res.send(apiFailureResponse);
    });
}

let saveFeedBack = (req, res) => {
    let addObj = {
        name: req.body.name,
        adminId: req.body.adminId,
        feedback: req.body.feedback,
        // message: req.body.message,
        // rating: req.body.rating
    }
    Model.Feedback.create(addObj).then(feedbackDetails => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Adding Feedback Details Successfully', feedbackDetails);
        return res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.setFailureResponse(err);
        return res.send(apiFailureResponse);
    });
}

let getCallDetils = async (req, res) => {
    await Model.Call.findAll({
        where: {
            adminId: req.query.adminId
        },
        order: [
            ['create_date', 'DESC'],
        ]
    }).then(callDetail => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Call Details get successfully', callDetail);
        res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.generate(err);
        res.send(apiFailureResponse);
    });
}

let updateUserDetail = async (req, res) => {
    let findObj = {
        where: {
            email: req.body.email
        }
    }
    let updateObj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.role,
        is_active: req.body.is_active
    }
    updateObj.password = passwordHash.generate(updateObj.password);

    await Model.User.update(updateObj, findObj).then(userDetails => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Upafting User Details Successfully', userDetails);
        return res.send(apiSuccessResponse);

    }).catch(err => {
        let apiFailuerResponse = response.setFailureResponse(err);
        return res.send(apiFailuerResponse);
    });
}

let authenticate = async (email, password) => {
    let deferred = q.defer();

    Model.User.findAll({
        where: { email: email }
    }).then(userDetail => {
        //console.log('UserDetials :: ====>> %j', userDetail)
        //console.log('password :: ====>> %j', password)
        if (userDetail.length) {
            let userInfo = userDetail[0];
            let isPasswordMatched = passwordHash.verify(password, userInfo.password);
            //console.log('Is Matched :: ', isPasswordMatched)
            if (isPasswordMatched) {
                let token = jwt.sign({ sub: userInfo.id }, appConfig.JWT_SECRET, {});
                let loggedInUser = {
                    "userId": userInfo.id,
                    "name": userInfo.name,
                    "username": userInfo.username,
                    "userRole": userInfo.user_role,
                    "role": userInfo.role,
                    "token": token,
                    "email": userInfo.email
                }
                deferred.resolve(loggedInUser);
            } else {
                //console.log('Invalid Password');
                deferred.reject('Inactive Password');
            }
        } else {
            //console.log('Inactive Account');
            deferred.reject('Inactive Account');
        }

    }).catch(err => {
        //console.log(err);
        deferred.reject(err);
    });
    return deferred.promise;
}

let getToken = async (req, res) => {
    //console.log('-->.', req.session)
    return res.send(req.session.token);
}

let login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
        let userInfo = await authenticate(email, password)
        if (req.session) {
            //console.log('Set session...')
            req.session.token = userInfo.token;
            req.session.userInfo = userInfo;
        }
        // console.log('Req session :: ', req.session);
        let apiSuccessResponse = response.setSuccessResponse(200, 'Success', userInfo);
        return res.send(apiSuccessResponse);
    } catch (err) {
        console.error('err :: ', err);
        let apiFailureResponse = response.setFailureResponse(err);
        res.send(apiFailureResponse);
    }
}

let getFeedbackById = (req, res) => {
    Model.Feedback.findAll({
        where: {
            adminId: req.body.adminId
        }
    }).then(feedback => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Get Feedback Successfull', feedback);
        return res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.setFailureResponse(err);
        return res.send(apiFailureResponse);
    })
}

let deleteAdminUser = (req, res) => {
    console.log('------req.params', req.params)
    Model.User.destroy({
        where: {
            id: req.params.id
        }
    }).then(resp => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Delete User Successfull', resp);
        return res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.setFailureResponse(err);
        return res.send(apiFailureResponse);
    });
}

let getAdminRatingById = async (req, res) => {
    await Model.Feedback.findAll({
        where: {
            adminId: req.query.adminId
        }
    }).then(ratingDetail => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Rating Details get successfully', ratingDetail);
        res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.generate(err);
        res.send(apiFailureResponse);
    });
}

let saveCallDetails = (req, res) => {
    let addObj = {
        adminId: req.body.adminId,
        username: req.body.username,
        duration: req.body.duration,
        subject: req.body.subject
    }
    // console.log('Add Obj :: ', addObj)
    Model.Call.create(addObj).then(callDetails => {
        let apiSuccessResponse = response.setSuccessResponse(200, 'Adding Call Details Successfully', callDetails);
        return res.send(apiSuccessResponse);
    }).catch(err => {
        let apiFailureResponse = response.setFailureResponse(err);
        return res.send(apiFailureResponse);
    });
}


module.exports = {
    sayHello: sayHello,
    getAllUserDetails: getAllUserDetails,
    getCallDetils: getCallDetils,
    getUserById: getUserById,
    createNewUser: createNewUser,
    authenticate: authenticate,
    getToken: getToken,
    login: login,
    saveFeedBack: saveFeedBack,
    getFeedbackById: getFeedbackById,
    updateUserDetail: updateUserDetail,
    deleteAdminUser: deleteAdminUser,
    getAdminRatingById: getAdminRatingById,
    saveCallDetails: saveCallDetails
}