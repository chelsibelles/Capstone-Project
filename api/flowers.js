const express = require("express");
const flowersRouter = express.Router();
const {
    createFlower,
    getAllFlowers,
    getFlowerById,
    updateFlower,
    deleteFlower,
} = require("../db/flowers");
const { checkFlowerData, requireUser } = require("./utils");

// Ensure the user is authenticated for all routes
flowersRouter.use(requireUser);

//GET /api/flowers
flowersRouter.get("/", async (req, res, next) => {
    try {
        const flowers = await getAllFlowers(req.user.id); // Ensure user_id is correct

        res.json({ flowers });
    } catch (error) {
        next(error); // Forward error to the error handler
    }
});

//POST /api/flowers
flowersRouter.post("/", checkFlowerData, async (req, res, next) => {
    try {
        const flower = await createFlower({ ...req.body, user_id: req.user.id });

        res.status(201).json({ flower });
    } catch (error) {
        next(error);
    }
});

//GET /api/flowers/:id
flowersRouter.get("/:id", async (req, res, next) => {
    try {
        const flower = await getFlowerById(parseInt(req.params.id));

        if (!flower) {
            return res.status(404).json({ error: 'Flower not found' });
        }

        res.json({ flower });
    } catch (error) {
        next(error);
    }
});

//PUT /api/flowers/:id
flowersRouter.put("/:id", checkFlowerData, async (req, res, next) => {
    try {
        const { name, description, care_instructions, img_url } = req.body;
        const flower = await updateFlower(parseInt(req.params.id), {
            name,
            description,
            care_instructions,
            img_url,
        });

        if (!flower) {
            return res.status(404).json({ error: 'Flower not found' });
        }

        res.json({ flower });
    } catch (error) {
        next(error);
    }
});

//DELETE /api/flowers/:id
flowersRouter.delete("/:id", async (req, res, next) => {
    try {
        const flower = await deleteFlower(parseInt(req.params.id));

        if (!flower) {
            return res.status(404).json({ error: 'Flower not found' });
        }

        res.status(204).end(); // No content to send back
    } catch (error) {
        next(error);
    }
});

module.exports = flowersRouter;
