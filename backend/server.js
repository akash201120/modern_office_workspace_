import  express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js"; // Ensure you import the correct file
import staffRoutes from "./routes/staffRoutes.js";
import path from "path";



const app = express();

dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",  // Replace with your frontend URL
    credentials: true,
  }));

  const _dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)

app.use("/api/tasks", taskRoutes);
app.use("/api/staffs", staffRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*',(_,res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT,() =>{
    console.log("server run on port:", PORT);
});

mongoose.connect(process.env.MONGO_URI)
.then(() =>console.log('Database connected'))
.catch(err => console.log('database failed',err))