const router = require('express').Router();

const { 
    noteGetController, noteGetOneController, notePostController,
    noteUpdateController, noteDeleteController
 } = require('../controllers/noteController');

router.get('/', noteGetController);
router.get('/note/:id', noteGetOneController);
router.post('/', notePostController);
router.put('/note/:id', noteUpdateController);
router.delete('/note/:id', noteDeleteController);

module.exports = router;