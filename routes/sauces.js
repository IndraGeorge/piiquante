const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/sauces')
const multer = require ('../middleware/multer-config')
const auth = require('../middleware/auth')

// Routes API CRUD
router.post('/', auth, multer, stuffCtrl.createSauce)
router.post('/:id/like', auth, stuffCtrl.getLikesSauce)
router.put('/:id',auth, multer, stuffCtrl.modifySauce )
router.delete('/:id',auth, stuffCtrl.deleteSauce ) 
router.get('/', auth, stuffCtrl.getSauces)
router.get('/:id', auth, stuffCtrl.getOneSauce)

 module.exports = router;
