const router = require('express').Router();

const { 
    usersGetController, getCurrentUserController, getOneUserController, userRegisterController,
    userLoginController, userUpdateController, userDeleteController
 } = require('../controllers/userController');

router.get('/', usersGetController);
router.get('/user', getCurrentUserController);
router.get('/user/:id', getOneUserController);
router.post('/register', userRegisterController);
router.post('/login', userLoginController);
router.put('/user', userUpdateController);
router.delete('/user', userDeleteController);

module.exports = router;