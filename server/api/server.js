import express from 'express'
import 'dotenv/config'
import '../config/db.js'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/user.routes.js'
import blogRoutes from '../routes/blog.routes.js'
import productRoutes from '../routes/product.routes.js'
import cartRoutes from '../routes/cart.routes.js'
import orderRoutes from '../routes/order.routes.js'

const app = express();
const Port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))
app.use(cookieParser());

const allowedOrigin = [
    process.env.FRONTEND_URL
]

const corsOptions = {
    origin: function (origin,callback) {
        if(allowedOrigin.indexOf(origin !== -1) || !origin){
            callback(null,true)
        }else {
            callback(new Error("Not allowed by cors policy"))
        } 
    },
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true
}
app.use(cors(corsOptions));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/',(_,res)=>{
    res.status(200).json({success: true,messege:"Response from the server"})
})

app.use('/api/user',userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(Port,()=>{
    console.log(`Server is running http://localhost:${Port}`)
})

export default app