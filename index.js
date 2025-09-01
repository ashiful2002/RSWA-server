require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

// middleware
// middleware
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:5174", // local dev
  "https://rswa-web-app.web.app", // Firebase hosting URL
  "https://rswaa.vercel.app", // Optional fallback
  "https://rrswa.vercel.app", // Optional fallback
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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // app.get("/blood-group", async (req, res) => {
    //   try {
    //     const search = req.query.search || "";

    //     const query = {
    //       $or: [
    //         { Blood_Group: { $regex: search, $options: "i" } },
    //         { Name: { $regex: search, $options: "i" } },
    //       ],
    //     };

    //     const result = await bloodGroupCollection.find(query).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Search error:", error);
    //     res.status(500).send({ message: "Server error" });
    //   }
    // });
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
      return res.status(400).send({ message: "No data provided for update" });
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
