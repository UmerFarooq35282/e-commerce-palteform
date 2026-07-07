import "dotenv/config.js"
import { app } from "./app.js";
import connectDatabase from "./config/database.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log("Server is running on PORT ", PORT);

        })

        process.on("SIGINT", async () => {
            console.log("\nShutting down server...");

            await mongoose.connection.close();

            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}


startServer();