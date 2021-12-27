const express = require('express');
const mongoose = require('mongoose');
const mongoUri = 'mongodb+srv://caeroberts:caeroberts@cluster0.ie20w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri);
require('./models/user');
require('./models/track');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes')
const bodyParser = require('body-parser');
const requireAuth = require('./middleware/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);


mongoose.connection.on('connected', () => {
    console.log('Now connected to Mongo Instance');
})

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
})


app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})