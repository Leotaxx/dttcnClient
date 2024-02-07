const { MongoClient } = require("mongodb");
const { authentication } = require('../netlify/helpers/index.ts');

// Assuming MongoClient initialization is the same as in the register function
const mongoClient = new MongoClient(process.env.MONGODB_URI);

const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 200, // To enable CORS for preflight OPTIONS request
            headers,
            body: 'This endpoint only supports POST requests.'
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Bad request body" }) };
    }

    const { email, password } = body;
    if (!email || !password) {
        return { statusCode: 400, headers, body: 'Missing email or password' };
    }

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.MONGODB_DATABASE);
        const userCollection = db.collection(process.env.MONGODB_COLLECTION_User);

        const user = await userCollection.findOne({ email });
        if (!user) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: "User not found" }) };
        }

        // Assuming your 'authentication' function can verify the password. Adjust as necessary.
        const isPasswordCorrect = authentication(user.authentication.salt, password) === user.authentication.password;
        if (!isPasswordCorrect) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid credentials" }) };
        }

        // User is authenticated
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "User created successfully", user: {email:user.email ,username:user.username,userId:user._id}})
        
        };
    } catch (error) {
        console.error('Error logging in:', error);
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ error: error.toString() }) 
        };
    }
};

module.exports = { handler };
