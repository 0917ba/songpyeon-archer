import { MongoClient } from 'mongodb';
const mongoPassword = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://09170917aa213:${mongoPassword}@cluster0.gemfinv.mongodb.net/?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true } as any;
let connectDB = new MongoClient(url, options).connect() as any;

export default connectDB;
