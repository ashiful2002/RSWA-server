const { getAuth } = require("../config/firebase.config");

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
    console.error(" Firebase token verification failed:", error.message);

    return res.status(403).send({
      message: "Forbidden access",
    });
  }
};

module.exports = verifyFirebaseToken;
