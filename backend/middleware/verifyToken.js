import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    console.log("Token Received:", req.headers.authorization); // Debugging log
    console.log("Extracted Token:", token); // Debugging log

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging log

        req.user = decoded; // Attach user info to req.user
        next();
    } catch (error) {
        console.error("Error in verifyToken:", error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
};
