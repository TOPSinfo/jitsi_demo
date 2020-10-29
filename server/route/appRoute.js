const appConfig = require('../config/appConfig');

const path = require('path');
const express = require('express');
const appController = require('../controller/ appController');
//const YAML = require('yamljs');
// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');
// const swaggerDocument = path.resolve('../controller/apiDocumentation.yaml');
//const authorization = require('../middleware/auth');

// const swaggerDefinition = {
//   basePath: '/', // Base path (optional)
// };

// const options = {
//   swaggerDefinition,
//   apis: ['./example/v2/routes*.js'], // <-- not in the definition, but in the options
// };

// const swaggerSpec = swaggerJSDoc(options);




let setAppRouter = (app) => {
  let baseUrl = appConfig.apiVersion + '/jitsiApp';
  // let baseUrl = '';
  console.log('baseUrl---->> ', baseUrl);
  //app.use(baseUrl + '/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  app.get(baseUrl + '/hello', appController.sayHello);
  //  app.post(baseUrl + '/login', appController.loginUser);

  /**
   * @swagger
   *  /jitsiApp/users :
   *  get:
   *     summary: Get Article List.
   *     parameters:
   *       - 
   *         name: listType
   *         required: true
   *         type: string
   *       - 
   *         name: slug
   *         required: true
   *         type: string
   *       - 
   *         name: pageIndex
   *         required: true
   *         type: string
   *     responses:
   *       '200':
   *         description: OK
   */
  app.get(baseUrl + '/users', appController.getAllUserDetails);
  //  Routes

  /**
   * @swagger
   *  /jitsiApp/users/details :
   *  get:
   *     summary: Get user by Id.
   *     parameters:
   *       - 
   *         name: listType
   *         required: true
   *         type: string
   *       - 
   *         name: slug
   *         required: true
   *         type: string
   *       - 
   *         name: pageIndex
   *         required: true
   *         type: string
   *     responses:
   *       '200':
   *         description: OK
   */

  app.get(baseUrl + '/users/details', appController.getUserById);
  //get call details 

  /**
   * @swagger
   *  /jitsiApp/users/calls :
   *  get:
   *     summary: Get users call List.
   *     parameters:
   *       - 
   *         name: listType
   *         required: true
   *         type: string
   *       - 
   *         name: slug
   *         required: true
   *         type: string
   *       - 
   *         name: pageIndex
   *         required: true
   *         type: string
   *     responses:
   *       '200':
   *         description: OK
   */
  app.get(baseUrl + '/users/calls', appController.getCallDetils);
  /**
   * @swagger
   *  /users/authenticate  :
   *  get:
   *     summary: Login.
   *     parameters:
   *       - 
   *         name: username
   *         required: true
   *         type: string
   *       - 
   *         name: password
   *         required: true
   *         type: string
   *     responses:
   *       '200':
   *         description: OK
   */
  app.post(baseUrl + '/users/login', appController.login);

  /**
 * @swagger
 *  /get-token  :
 *  get:
 *     summary: Get Token.
 *     responses:
 *       '200':
 *         description: OK
 */
  app.get(baseUrl + '/get-token', appController.getToken);
  /**
     * @swagger
     *  /users/add-user  :
     *  post:
     *     summary: Add New User.
     *     parameters:
     *       - 
     *         name: name
     *         required: true
     *         type: string
     *       - 
     *         name: email
     *         required: true
     *         type: string
     *       - 
     *         name: password
     *         required: true
     *         type: string
     *       - 
     *         name: user_role
     *         required: true
     *         type: string
     *       - 
     *         name: is_active
     *         required: true
     *         type: string
     *     responses:
     *       '200':
     *         description: OK
     */
  app.post(baseUrl + '/users', appController.createNewUser);
  /**
     * @swagger
     *  /users  :
     *  post:
     *     summary: Add New User.
     *     parameters:
     *       - 
     *         name: name
     *         required: true
     *         type: string
     *       - 
     *         name: email
     *         required: true
     *         type: string
     *       - 
     *         name: password
     *         required: true
     *         type: string
     *       - 
     *         name: user_role
     *         required: true
     *         type: string
     *       - 
     *         name: is_active
     *         required: true
     *         type: string
     *     responses:
     *       '200':
     *         description: OK
     */
  app.put(baseUrl + '/users', appController.updateUserDetail);
  /**
     * @swagger
     *  /users/feedback  :
     *  post:
     *     summary: Add Feedback.
     *     parameters:
     *       - 
     *         name: name
     *         required: true
     *         type: string
     *       - 
     *         name: adminId
     *         required: true
     *         type: string
     *       - 
     *         name: feedback
     *         required: true
     *         type: string
     *       - 
     *         name: message
     *         required: true
     *         type: string
     *     responses:
     *       '200':
     *         description: OK
     */
  app.post(baseUrl + '/users/feedback', appController.saveFeedBack);
  /**
     * @swagger
     *  /jitsiApp/users/feedback :
     *  get:
     *     summary: Get Feedback By Id.
     *     parameters:
     *       - 
     *         name: adminId
     *         required: true
     *         type: string
     *     responses:
     *       '200':
     *         description: OK
     */

  app.get(baseUrl + '/users/feedback', appController.getFeedbackById);

  /**
    * @swagger
    *  /jitsiApp/users :
    *  delete:
    *     summary: Delete users.
    *     parameters:
    *       - 
    *         userId:userId 
    *         required: true
    *         type: string
    *     responses:
    *       '200':
    *         description: OK
    */

  app.delete(baseUrl + '/users/:id', appController.deleteAdminUser);

  /**
    * @swagger
    *  /jitsiApp/users/rating :
    *  get:
    *     summary: Get Rating By Id.
    *     parameters:
    *       - 
    *         name: adminId
    *         required: true
    *         type: string
    *     responses:
    *       '200':
    *         description: OK
    */

  app.get(baseUrl + '/users/rating', appController.getAdminRatingById);
  /**
       * @swagger
       *  /users/calls  :
       *  post:
       *     summary: Save Call Details.
       *     parameters:
       *       - 
       *         name: name
       *         required: true
       *         type: string
       *       - 
       *         name: adminId
       *         required: true
       *         type: string
       *       - 
       *         name: feedback
       *         required: true
       *         type: string
       *       - 
       *         name: message
       *         required: true
       *         type: string
       *     responses:
       *       '200':
       *         description: OK
       */
  app.post(baseUrl + '/users/calls', appController.saveCallDetails);

}
module.exports = {
  setAppRouter: setAppRouter
}