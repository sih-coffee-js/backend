import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose.config.js";
import authRoutes from "./routes/auth.route.js"
import cors from "cors";
import notificationsRoutes from './routes/notification.routes.js'
import locationsRoutes from "./routes/locations.route.js"
import trackRecordsRoutes from "./routes/trackRecords.route.js";
import usersRoutes from "./routes/users.route.js";
import trackRoutes from "./routes/track.route.js"
dotenv.config();
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGOURI;

connectDB(mongoURI);
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/track', trackRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notification', notificationsRoutes);
app.use('/api/location', locationsRoutes);
app.use('/api/record', trackRecordsRoutes);

app.listen(PORT, () => {
  console.log("App is listening on port:", PORT);
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.json({
    success: false,
    statusCode,
    message,
  });
});