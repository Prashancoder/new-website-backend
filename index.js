import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import blogRouter from "./routes/blogRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Required in production for secure cookies
app.set("trust proxy", 1);

app.use(
    cors({
        origin: [
            "https://www.timelessaestheticss.com",
            "https://new-website-frontend-alpha.vercel.app",
            "http://localhost:5137",
            "http://localhost:5174",
            "http://localhost:8000",

            process.env.FRONTEND_URL
        ],
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);
app.use("/api/blogs", blogRouter);

app.get("/", (req, res) => {
    res.send("Hello From Server");
});

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
});
