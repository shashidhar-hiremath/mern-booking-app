import express, { Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongooes from 'mongoose';
import userRoute from "./routes/users";
import authRoute from "./routes/auth";
import myhotelsRoute from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from 'path';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

mongooes.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true})); // prase url
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// app.get('/api/test', async (req: Request, res: Response) => {
//     res.json({ message: 'helo from first dev.'})
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/my-hotels", myhotelsRoute);

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});


app.listen(7000, () => {
    console.log('server is running!!!');    
})
