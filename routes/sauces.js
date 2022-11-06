const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/sauces')
const multer = require ('../middleware/multer-config')
const auth = require('../middleware/auth')

// Routes API CRUD
router.post('/', auth, multer, stuffCtrl.createThing)
router.put('/:id',auth, multer, stuffCtrl.modifyThing )
router.delete('/:id',auth, stuffCtrl.deleteThing ) 
router.get('/', auth, stuffCtrl.getThings)
router.get('/:id', auth, stuffCtrl.getOnething)
router.post('/:id/like', auth, multer, stuffCtrl.getLikesThing)

 module.exports = router;
