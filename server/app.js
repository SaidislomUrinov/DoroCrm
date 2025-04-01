import "./src/configs/configure.js";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "http";
import { initializeSocket } from "./src/utils/socket.js";
import { connectRedis } from "./src/configs/redis.js";
import connectDb from "./src/configs/db.js";
import router from "./src/router.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

await connectRedis();
await connectDb();

const server = http.createServer(app);
initializeSocket(server);

app.use('/uploads', express.static('uploads'));
app.use('/api', router);

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
