const express = require('express')

const DataCtrl = require('../controllers/data-ctrl')

const router = express.Router()

router.post('/data', DataCtrl.createData)
router.put('/data/:id', DataCtrl.updateData)
router.delete('/data/:id', DataCtrl.deleteData)
router.get('/data/:id', DataCtrl.getDataById)
router.get('/dataset', DataCtrl.getData)

module.exports = router