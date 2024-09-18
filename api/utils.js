// utils.js

// Middleware to ensure the user is authenticated
function requireUser(req, res, next) {
    if (!req.user || !req.user.user_id) {
        return res.status(401).send("Unauthorized: You must be logged in to do that.");
    }
    next();
}

// Middleware to validate flower data
function checkFlowerData(req, res, next) {
    const { care_instructions, name } = req.body;
    if (!care_instructions || !name) {
        return res.status(400).send("Bad Request: Please provide both flower name and care instructions.");
    }
    next();
}

module.exports = {
    checkFlowerData,
    requireUser,
};
