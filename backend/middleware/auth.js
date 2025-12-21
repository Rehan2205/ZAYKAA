import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded_token.id; // safer than modifying req.body
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authMiddleware;
