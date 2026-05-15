const express = require('express');
const router = express.Router();
const { getAll, getOne, getAllTypes, getAllDietsController, insert, update, remove } = require('../controllers/petController');

router.get('/', getAll);
router.get('/breeds', getAllTypes);
router.get('/diets', getAllDietsController);
router.get('/:id', getOne);
router.post('/', insert);
router.put('/:id', update);
router.delete('/:id', remove);


module.exports = router;