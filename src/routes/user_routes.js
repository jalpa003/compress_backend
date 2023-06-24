const userRoutes = require('express').Router();
const UserController = require('../controller/user_controller');
const upload = require('../middleware/file_upload');
const requirelogin = require('../middleware/requirelogin');

userRoutes.post("/signup",UserController.signup);
userRoutes.post("/login",UserController.login);
userRoutes.post("/docxtopdf",upload.single('file'),UserController.doctodpf);
userRoutes.post("/changepassword",requirelogin,UserController.changepassword);

module.exports = userRoutes;