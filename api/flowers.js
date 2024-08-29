const express = require("express");
const flowersRouter = express.Router();
const {
    createFlower,
    getAllFlowers,
    getFlowerById,
    updateFlower,
    deleteFlower,
} = require ("../db/flowers");
const { checkFlowerData } = require("./utils");

//GET /api/flowers
flowersRouter.get("/", async (req, res, next) => {
    try {
        const flowers = await getAllFlowers(req.user.user_id);

        res.send ({ flowers });
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

//POST /api/flowers
flowersRouter.post ("/", async(req, res, next) => {
    try {
        const flower = await createFlower ({ ...req.body,user_id:req.user,user_id });

        res.send ({ flowers });
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

//GET /api/flowers/:id
flowersRouter.get(":id", async(req, res, next) => {
    try {
        const flower = await getFlowerById (parseInt(req.params.id));

        res.send ({ flowers });
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

//PUT /api/flowers/:id
flowersRouter.put(":id", async(req, res, next) => {
    try {
        const { name, description, care_instructions, img_url } = req.body;
        const flower = await updateFlower (parseInt(req.params.id), {
            name,
            description,
            care_instructions,
            img_url,
        });

        res.send ({ flowers });
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

//DELETE /api/flowers/:id
flowersRouter.delete(":id", async(req, res, next) => {
    try {
        const flower = await deleteFlower (parseInt(req.params.id));

        res.send ({ flowers });
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

module.exports = flowersRouter;