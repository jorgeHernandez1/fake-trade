const express = require('express');
const APIroutes = require('./routes');
const sequelize = require('./config/connection');
const { User } = require('./models');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('./config/passport')(User);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(APIroutes);

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
