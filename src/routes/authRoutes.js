const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('reactUser');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = new User({email, password})
        await user.save();

        const token = jwt.sign({userId: user._id}, 'test')
        res.send({token})
    } catch (err) {
        console.log('Error!')
        console.log(err.message)
        return res.status(422).send(err.message)
    };
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(422).send({ error: 'Invalid email or password' });
    }
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'test');
        res.send({token});
    } catch (err) {
        return res.status(422).send({ error: 'Invalid email or password' })
    }
})

module.exports = router;