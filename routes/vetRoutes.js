const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, search, project } = require('../controllers/vetController');

router.get('/', getAll);
router.post('/search', search);
router.post('/project', project);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;