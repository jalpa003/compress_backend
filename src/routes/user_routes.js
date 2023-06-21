const userRoutes = require('express').Router();
const UserController = require('../controller/user_controller');
const upload = require('../middleware/file_upload');


userRoutes.post("/signup",UserController.signup);
userRoutes.post("/docxtopdf",upload.single('file'),UserController.doctodpf);
userRoutes.post("/audio",upload.single('file'),UserController.audiocompress);

module.exports = userRoutes;