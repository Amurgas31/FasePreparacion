import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes
// estudiantes
import studentRoutes from "./src/routes/students.js";
import registerStudentRoutes from "./src/routes/registerStudent.js";
import loginStudentsRoutes from "./src/routes/loginStudents.js";
import recoveryPasswordStudentRoutes from "./src/routes/recoveryPasswordStudent.js";
// especialidades
import specialityRoutes from "./src/routes/specialities.js";
//logout
import logoutRoutes from "./src/routes/logout.js";

const app = express();
app.use(
  cors({
    origin: ["http:localhost:5173/", "https:localhost:5174/"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/registerStudent", registerStudentRoutes);
app.use("/api/loginStudents", loginStudentsRoutes);
app.use("/api/recoveryPasswordStudent", recoveryPasswordStudentRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/specialities", specialityRoutes);

export default app;
