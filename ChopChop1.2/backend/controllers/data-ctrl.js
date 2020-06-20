const Data = require('../models/data-model')

createData = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a distance',
        })
    }

    const data = new Data(body)

    if (!data) {
        return res.status(400).json({ success: false, error: err })
    }

    data
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: data._id,
                message: 'Distance saved!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Distance not saved!',
            })
        })
}

updateData = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a distance to update',
        })
    }

    Data.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Distance not found!',
            })
        }
        data.userID = body.userID
        data.maxDistance = body.maxDistance
        data
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: data._id,
                    message: 'Data updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Data not updated!',
                })
            })
    })
}

deleteData = async (req, res) => {
    await Data.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Data not found` })
        }

        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

getDataById = async (req, res) => {
    await Data.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Data not found` })
        }
        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

getData = async (req, res) => {
    await Data.find({}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!movies.length) {
            return res
                .status(404)
                .json({ success: false, error: `Data not found` })
        }
        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

module.exports = {
    createData,
    updateData,
    deleteData,
    getData,
    getDataById,
}