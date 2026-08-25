const bloodGroupService = require("./bloodGroup.service");

const getBloodGroups = async (req, res) => {
  try {
    const result = await bloodGroupService.getBloodGroupsFromDB(req.query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const updateBloodGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bloodGroupService.updateBloodGroupInDB(id, req.body);
    res.send(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).send({ message: error.message });
    }
    console.error("Update error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

const deleteBloodGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bloodGroupService.deleteBloodGroupFromDB(id);
    res.send(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).send({ message: error.message });
    }
    console.error("Delete error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

const createBloodGroup = async (req, res) => {
  try {
    const result = await bloodGroupService.createBloodGroupInDB(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).send({ success: false, error: "Server error" });
  }
};

module.exports = {
  getBloodGroups,
  updateBloodGroup,
  deleteBloodGroup,
  createBloodGroup,
};
