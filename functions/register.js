const { MongoClient } = require("mongodb");
const { random, authentication } = require('../netlify/helpers/index.ts');

// Create a new MongoClient
const mongoClient = new MongoClient(process.env.MONGODB_URI);

const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      };

    
    if (event.httpMethod !== 'POST') {
        // To enable CORS
        return {
          statusCode: 200, // <-- Important!
          headers,
          body: 'This was not a POST request!'
        };
     }
        let body;
        try {
            body = JSON.parse(event.body);
            // console.log(body);
        } catch (error) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Bad request body" }) };
        }
    
        const { email, password, username, inviteCode } = body;
        // console.log(email,password,username,inviteCode);
        if (!email || !password || !username || !inviteCode) {
            return { statusCode: 400, headers,body: 'Missing required fields' };
        }
        
    try{
        // Connect to the database
        const db = (await mongoClient.connect()).db(process.env.MONGODB_DATABASE);
        const codeCollection = db.collection(process.env.MONGODB_COLLECTION_Code);
        const userCollection = db.collection(process.env.MONGODB_COLLECTION_User);

        // Check if invite code exists and is new
        const codeResult = await codeCollection.findOne({ inviteCode:inviteCode });
       
        console.log(codeResult);
        if (!codeResult||codeResult.inviteCodeStatus!=='new') {
            return { statusCode: 400, headers,body: 'No matched code or code already used' };
        }

        // Check if email has already been used
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return { statusCode: 400,headers, body: 'Email has already been used' };
        }

        // Create new user
        const salt = random();
        const hashedPassword = authentication(salt, password);
        const result = await userCollection.insertOne({
            email,
            username,
            authentication: {
                salt,
                password: hashedPassword,
            },
            inviteCode,
        });

        // Mark invite code as used
        await codeCollection.updateOne({ inviteCode :inviteCode}, { $set: { inviteCodeStatus: 'used' } });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "User created successfully", user: {email:result.email ,username:result.username,userId:result.insertedId}}),
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ error: error.toString() }) 
        };      
    }
        // Safely parse the event body

        
}

module.exports = { handler };