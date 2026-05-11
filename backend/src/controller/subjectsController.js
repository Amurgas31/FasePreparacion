import subjectsModel from "../models/subjects.js";
const subjectsController = {};

//Select
subjectsController.getSubjects = async (req, res) => {
  try {
    const subjects = await subjectsModel.find();
    return res.status(200).json(subjects);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Insert
subjectsController.insertSubject = async (req, res) => {
  const { subjectName, teacher_id, isAvailable } = req.body;
  const newSubject = new subjectsModel({
    subjectName,
    teacher_id,
    isAvailable,
  });
  await newSubject.save();
  res.json({ message: "Subject Saved" });
};

//Update
subjectsController.updateSubject = async (req, res) => {
  try {
    let { subjectName, teacher_id, isAvailable } = req.body;
    subjectName = subjectName?.trim();

    if (!subjectName || !teacher_id) {
      return res.status(400).json({ message: "Fields required" });
    }

    const subjectUpdated = await subjectsModel.findByIdAndUpdate(
      req.params.id,
      {
        subjectName,
        teacher_id,
        isAvailable
      },
      {
        new: true,
      },
    );

    if (!subjectUpdated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json({ message: "Subject Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
subjectsController.deleteSubject = async (req, res) => {
  try {
    const deleteSubject = await subjectsModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteSubject) {
      return res.status(404).json({ message: "Subject Not Found" });
    }

    return res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default subjectsController;
