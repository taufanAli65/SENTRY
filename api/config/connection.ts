import { MongoClient, ServerApiVersion } from 'mongodb';

const url = process.env.MONGODB_URL as string;
const database_name = process.env.DB_NAME as string;

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connectDB() {
    try {
        await client.connect();
        await client.db(database_name).command({ ping: 1 });
        console.log("Successfully Connected to the database");
        return client;
    } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
    }
}

export default client;