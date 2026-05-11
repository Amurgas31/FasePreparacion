import specialityModel from "../models/specialities.js";
const specialityController = {};

//Select
specialityController.getSpeciality = async (req, res) => {
  try {
    const specialities = await specialityModel.find();
    return res.status(200).json(specialities);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Insert
specialityController.insertSpeciality = async (req, res) => {
  const { specialityName, isAvailable } = req.body;
  const newSpeciality = new specialityModel({ specialityName, isAvailable });
  await newSpeciality.save();
  res.json({ message: "Speciality Saved" });
};

//Update
specialityController.updateSpeciality = async (req, res) => {
  try {
    let { specialityName, isAvailable } = req.body;
    specialityName = specialityName?.trim();

    if (!specialityName) {
      return res.status(400).json({ message: "Fields required" });
    }

    const specialityUpdated = await specialityModel.findByIdAndUpdate(
      req.params.id,
      {
        specialityName,
        isAvailable,
      },
      {
        new: true,
      },
    );

    if (!specialityUpdated) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    return res.status(200).json({ message: "Speciality Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
specialityController.deleteSpeciality = async (req, res) => {
  try {
    const deleteSpeciality = await specialityModel.findByIdAndDelete(req.params.id);
    if (!deleteSpeciality) {
      return res.status(404).json({ message: "Speciality Not Found" });
    }

    return res.status(200).json({ message: "Speciality Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default specialityController;
