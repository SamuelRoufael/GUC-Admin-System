const{app} = require('./app')
const mongoose = require('mongoose')
require('dotenv').config() //in order to be able to read the .env
mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true}).then(console.log("pass"))
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true); 
app.listen(process.env.PORT)

