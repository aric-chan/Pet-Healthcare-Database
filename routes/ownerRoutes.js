const express = require('express');
const router = express.Router();
const { getAll, getOne, insert, update, remove, join, best } = require('../controllers/ownerController');

router.get('/', getAll);
//pet 
router.get('/pets', join);
router.get('/pets/best', best);
router.get('/:id', getOne);
router.post('/', insert);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;