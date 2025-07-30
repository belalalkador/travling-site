import jwt from "jsonwebtoken";


const verifyToken = (req, res, next) => {

  const token = req.cookies.access_token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided, access denied" });
  }

  try {
   
    const decoded = jwt.verify(token, "belal_alkador_12345_some_text-moreText");

    req.user = decoded;

  
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
