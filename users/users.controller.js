const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/sendsms', sendsms);
router.get('/verifysms', verifysmsCode);

router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;
function sendsms(req,res,next){
 const Client = require('authy-client').Client;
	const authy = new Client({key: "WtaHZrQBNmlUkaUWwCxmpZV5oblKBQTo"});
	const enums = require('authy-client').enums;
	const responseSms = authy.startPhoneVerification({ countryCode: req.body.countryCode, locale:"en", phone: req.body.phoneNumber, via: enums.verificationVia.SMS });

    return res.send(responseSms);
}

function verifysmsCode(req,res,next){
    const Client = require('authy-client').Client;
       const authy = new Client({key: "WtaHZrQBNmlUkaUWwCxmpZV5oblKBQTo"});
       const enums = require('authy-client').enums;
       const responseSms = authy.verifyPhone({ countryCode: req.body.countrycode, phone: req.body.phoneNumber, token: req.body.smsCode });
       return res.send(responseSms);
   }

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}