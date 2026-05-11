import teachersModel from "../models/teachers.js";
const teacherController = {};

//Select
teacherController.getTeachers = async (req, res) => {
  try {
    const teachers = await teachersModel.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
teacherController.updateTeachers = async (req, res) => {
  try {
    let {
      name,
      lastName,
      email,
      password,
      phone,
      hireDate,
      isActive,
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

    const teacherUpdated = await teachersModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        phone,
        hireDate,
        isActive,
        isVerified,
        loginAttempts,
        timeOut,
      },
      {
        new: true,
      },
    );

    if (!teacherUpdated) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({ message: "Teacher Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
teacherController.deleteTeacher = async (req, res) => {
  try {
    const deleteTeacher = await teachersModel.findByIdAndDelete(req.params.id);
    if (!deleteTeacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }

    return res.status(200).json({ message: "Teacher Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default teacherController;