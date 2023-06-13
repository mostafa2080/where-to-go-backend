const mongoose = require('mongoose')
const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const path = require('path')
const ApiError = require('../utils/apiError')

const Customer = require('./../models/Customer')
require('./../models/Vendor')
const Vendor = mongoose.model('vendor')

exports.addPlaceToFavourite = AsyncHandler( async(req, res, next) => {
    const vendor = await Vendor.findOne({_id: req.body.vendorId})
    if (!vendor) {
        throw new ApiError('No such vendor exists...!')
    }

    const customer = await Customer.findOne({_id: req.body.customerId})
    if (!customer) {
        throw new ApiError('No such customer exists...!')
    }

    const vendorId = req.body.vendorId

    if (customer.favouritePlaces.includes(vendorId)) {
        return res.status(400).json({
            success: false,
            message: "This vendor place already exists in your favorites.",
        })
    }

    customer.favouritePlaces.push(vendorId)
    const updatedCustomer = await customer.save()

    if (!updatedCustomer) {
        return new ApiError('Cannot add this place to your favourites', 400)
    }
    
    res.status(200).json({
        success: true,
        message: 'Place added to your favourites.',
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

    if (!customer.favouritePlaces.includes(vendorId)){
        throw new ApiError('This place is not exist in your favourites...!')
    }

    customer.favouritePlaces.pull(vendorId)
    const updatedCustomer = customer.save()

    if (!updatedCustomer) {
        return new ApiError('Cannot add this place to your favourites', 400)
    }

    return res.status(200).json({
        success: true,
        message: 'Place removed successfully from your favourites.',
        data: updatedCustomer
    })


})