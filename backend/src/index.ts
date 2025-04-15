const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {connectDB} = require('./config/configuration');
import userrouter from './routes/user';
import problemrouter from './routes/problem';
import auth from './middleware/auth';
connectDB();

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/user",userrouter);
app.use("/api/problem",problemrouter);

app.listen(process.env.PORT, () => {
    console.log(`server is connected at port ${process.env.PORT}`); 
});