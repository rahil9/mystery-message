import { log } from "console";
import { console } from "inspector";
import mongoose from "mongoose";

type ConnectionObject = {
    // value may/may not be returned
    // ? = optional
    isConnected?: number
}

const connection: ConnectionObject = {}

// as it will take time we use async
// we don't care about the value which is returned so Promise is followed by <void>
// void in cpp, java is different then the void that is used here
async function dbConnect(): Promise<void> {
    // checking if already connection is established
    // others there would be database choking and performance would be hampered
    if(connection.isConnected) {
        console.log("connection is already established");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        // connection is an array
        connection.isConnected = db.connections[0].readyState
        console.log("connected to the database");
    } catch(error) {
        // gracefully exit the connection
        console.log("failed to connect to the database", error);
        // 1 means ending with some failure
        process.exit(1)
    }
}

export default dbConnect;