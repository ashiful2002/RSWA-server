const express = require("express");
const bloodGroupController = require("./bloodGroup.controller");

const router = express.Router();

router.get("/", bloodGroupController.getBloodGroups);
router.post("/", bloodGroupController.createBloodGroup);
router.put("/:id", bloodGroupController.updateBloodGroup);
router.delete("/:id", bloodGroupController.deleteBloodGroup);

module.exports = router;
