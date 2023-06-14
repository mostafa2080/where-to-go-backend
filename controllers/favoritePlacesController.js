const mongoose = require('mongoose')
const AsyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')

const Customer = require('../models/Customer')
require('../models/Vendor')
const Vendor = mongoose.model('vendor')

exports.addPlaceToFavorite = AsyncHandler( async(req, res, next) => {
    const vendor = await Vendor.findOne({_id: req.body.vendorId})
    if (!vendor) {
        throw new ApiError('No such vendor exists...!')
    }

    const customer = await Customer.findOne({_id: req.body.customerId})
    if (!customer) {
        throw new ApiError('No such customer exists...!')
    }

    const vendorId = req.body.vendorId

    if (customer.favoritePlaces.includes(vendorId)) {
        return res.status(400).json({
            success: false,
            message: "This vendor place already exists in your favorites.",
        })
    }

    customer.favoritePlaces.push(vendorId)
    const updatedCustomer = await customer.save()

    if (!updatedCustomer) {
        return new ApiError('Cannot add this place to your favorites', 400)
    }
    
    res.status(200).json({
        success: true,
        message: 'Place added to your favorites.',
        data: updatedCustomer
    })
})

exports.removePlace = AsyncHandler( async(req, res, next) => {
    const vendor = await Vendor.findOne({_id: req.body.vendorId})
    if (!vendor) {
        throw new ApiError('No such vendor exists...!')
    }

    const customer = await Customer.findOne({_id: req.body.customerId})
    if (!customer) {
        throw new ApiError('No such customer exists...!')
    }

    const vendorId = req.body.vendorId

    if (!customer.favoritePlaces.includes(vendorId)){
        throw new ApiError('This place is not exist in your favorites...!')
    }

    customer.favoritePlaces.pull(vendorId)
    const updatedCustomer = customer.save()

    if (!updatedCustomer) {
        return new ApiError('Cannot add this place to your favorites', 400)
    }

    return res.status(200).json({
        success: true,
        message: 'Place removed successfully from your favorites.',
        data: updatedCustomer
    })


})