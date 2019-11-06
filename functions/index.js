import firebaseFunctions from 'firebase-functions'
import basicAuthConnect from 'basic-auth-connect'
import express from 'express'

const USERNAME = 'test'
const PASSWORD = 'test'
const express = express()

express.use(basicAuthConnect((USERNAME, PASSWORD)))
express.use(express.static(__dirname + '/dist/'))
exports.firebaseAuth = firebaseFunctions.https.onRequest(express)
