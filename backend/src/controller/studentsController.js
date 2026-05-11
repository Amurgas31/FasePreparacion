import studentsModel from "../models/students.js";
const studentController = {};

//Select
studentController.getStudents = async (req, res) => {
  try {
    const students = await studentsModel.find();
    return res.status(200).json(students);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
studentController.updateStudents = async (req, res) => {
  try {
    let {
      name,
      lastName,
      email,
      password,
      birthdate,
      speciality_id,
      carnet,
      phone,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;
    name = name?.trim();
    email = email?.trim();
    lastName = lastName?.trim();

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    const studentUpdated = await studentsModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        birthdate,
        speciality_id,
        carnet,
        phone,
        isVerified,
        loginAttempts,
        timeOut,
      },
      {
        new: true,
      },
    );

    if (!studentUpdated) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
studentController.deleteStudent = async (req, res) => {
  try {
    const deleteStudent = await studentsModel.findByIdAndDelete(req.params.id);
    if (!deleteStudent) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    return res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default studentController;