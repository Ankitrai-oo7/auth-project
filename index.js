import express from "express"
import dotenv from 'dotenv';
dotenv.config();
import connectToDb from "./database/db.js";
import authRoute from "./routes/auth-routes.js";
import homeRoute from "./routes/home-routes.js";
import adminRoute from "./routes/admin-routes.js";
import imageRoute from "./routes/image-routes.js"


const app = express();
app.use(express.json());
app.use('/api/auth',authRoute);
app.use('/api/home',homeRoute);
app.use('/api/admin',adminRoute);
app.use('/api/image',imageRoute);

const PORT = process.env.PORT || 3000;
connectToDb();
app.listen(PORT,()=>{
        console.log(`Server is running on Port ${PORT}`)
})