const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces')
const likeCtrl = require('../controllers/like')
const multer = require ('../middleware/multer-config')
const auth = require('../middleware/auth')

// Routes API CRUD
router.post('/', auth, multer, sauceCtrl.createSauce)
router.post('/:id/like', auth, likeCtrl.likesAndDislikeSauce)
router.put('/:id',auth, multer, sauceCtrl.modifySauce )
router.delete('/:id',auth, sauceCtrl.deleteSauce ) 
router.get('/', auth, sauceCtrl.getSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)

 module.exports = router;
