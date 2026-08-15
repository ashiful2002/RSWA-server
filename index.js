require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 4000;

// middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "https://rswa-web-app.web.app",
  "https://rswaa.vercel.app",
  "https://rrswa.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized access",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);

    // console.log("Authenticated user:", decoded.email);

    req.decoded = decoded;

    next();
  } catch (error) {
    console.error("🔥 Firebase token verification failed:", error.message);

    return res.status(403).send({
      message: "Forbidden access",
    });
  }
};
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.eitqwxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("bloodGroup");
    const bloodGroupCollection = database.collection("BloodGroupCollection");
    const usersCollection = database.collection("users");

    // === users apis ==============
    // get users
    app.get("/users", verifyFirebaseToken, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    app.get("/users/:email/role", verifyFirebaseToken, async (req, res) => {
      const userEmail = req.params.email;
      const user = await usersCollection.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send({ role: user.role || "user" });
    });

    // update users role
    app.put("/users/:email/role", verifyFirebaseToken, async (req, res) => {
      const { email } = req.params;
      const { role } = req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { role } }
      );
      res.send(result);
    });
    // update users as fraud

    app.put("/users/:email/fraud", verifyFirebaseToken, async (req, res) => {
      const { email } = req.params;
      try {
        await usersCollection.updateOne(
          { email },
          { $set: { status: "fraud" } }
        );
        await propertiesCollection.deleteMany({ agent_email: email });
        res.send({ message: "Marked as fraud and properties removed" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // update user useing put
    app.put("/users/:email", verifyFirebaseToken, async (req, res) => {
      const { email } = req.params;
      const updateData = req.body;
      const result = await usersCollection.updateOne(
        { email },
        {
          $set: updateData,
        }
      );
      res.send(result);
    });
    // post apis
    app.post("/users", verifyFirebaseToken, async (req, res) => {
      const userData = req.body;

      try {
        const existingUser = await usersCollection.findOne({
          email: userData.email,
        });

        if (existingUser) {
          // update only the last log in

          const result = await usersCollection.updateOne(
            {
              email: userData.email,
            },
            {
              $set: { last_log_in: new Date().toISOString() },
            }
          );
          return res.send({ message: "User log in updated", result });
        } else {
          // if new user - set both
          userData.created_at = new Date().toISOString();
          userData.last_log_in = new Date().toISOString();

          const result = await usersCollection.insertOne(userData);
          return res.send({ message: "New User created", result });
        }
      } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send({ error: "Failed to save user" });
      }
    });

    app.delete("/users/:email", verifyFirebaseToken, async (req, res) => {
      const { email } = req.params;

      const result = await usersCollection.deleteOne({ email });

      res.send(result);
    });
    // ============================= users apis ends ========

    app.get("/blood-group", async (req, res) => {
      try {
        const {
          search = "",
          bloodGroup = "",
          sortField = "Name",
          sortOrder = "asc",
          page = 1,
          limit = 20,
        } = req.query;

        const query = {
          $and: [
            {
              $or: [
                { Name: { $regex: search, $options: "i" } },
                { Blood_Group: { $regex: search, $options: "i" } },
              ],
            },
            ...(bloodGroup ? [{ Blood_Group: bloodGroup }] : []),
          ],
        };

        const total = await bloodGroupCollection.countDocuments(query);

        const donors = await bloodGroupCollection
          .find(query)
          .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .toArray();

        res.send({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
          data: donors,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });
    // Utility function to remove empty keys
    const cleanData = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([key]) => key && key.trim() !== "")
      );
    };
    app.put("/blood-group/:id", async (req, res) => {
      try {
        const { id } = req.params;
        let updatedData = req.body;

        console.log("id and data is coming", id, updatedData);

        // Clean data to remove empty keys
        updatedData = cleanData(updatedData);

        if (!updatedData || Object.keys(updatedData).length === 0) {
          return res
            .status(400)
            .send({ message: "No data provided for update" });
        }

        const result = await bloodGroupCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Donor not found" });
        }

        res.send({ message: "Donor updated successfully" });
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });
    // Delete a donor by ID
    app.delete("/blood-group/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid donor ID" });
        }

        const result = await bloodGroupCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Donor not found" });
        }

        res.send({ message: "Donor deleted successfully" });
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.post("/blood-group", async (req, res) => {
      try {
        const data = req.body;
        const result = await bloodGroupCollection.insertOne(data);
        console.log(result);

        res.status(201).send({ success: true, message: "Data saved", result });
      } catch (error) {
        console.error("Insert error:", error);
        res.status(500).send({ success: false, error: "Server error" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run();

app.get("/", (req, res) => {
  res.send(`RSWA server is running`);
});

app.listen(port, () => {
  console.log(`RSWA  server is runnning in port ${port}`);
});
