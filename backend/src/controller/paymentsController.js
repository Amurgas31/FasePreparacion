import paymentsModel from "../models/payments.js";
const paymentController = {};

//Select
paymentController.getPayments = async (req, res) => {
  try {
    const payments = await paymentsModel.find();
    return res.status(200).json(payments);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Insert
paymentController.insertPayment = async (req, res) => {
  const { student_id, amount, paymentDate, method, status, referenceNumber } =
    req.body;
  const newPayment = new paymentsModel({
    student_id,
    amount,
    paymentDate,
    method,
    status,
    referenceNumber,
  });
  await newPayment.save();
  res.json({ message: "Payment Saved" });
};

//Update
paymentController.updatePayment = async (req, res) => {
  try {
    let { student_id, amount, paymentDate, method, status, referenceNumber } =
      req.body;
    student_id = student_id?.trim();
    method = method?.trim();

    if (!student_id || !referenceNumber) {
      return res.status(400).json({ message: "Fields required" });
    }

    const paymentUpdated = await paymentsModel.findByIdAndUpdate(
      req.params.id,
      {
        student_id,
        amount,
        paymentDate,
        method,
        status,
        referenceNumber,
      },
      {
        new: true,
      },
    );

    if (!paymentUpdated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ message: "Payment Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
paymentController.deletePayment = async (req, res) => {
  try {
    const deletePayment = await paymentsModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletePayment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }

    return res.status(200).json({ message: "Payment Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default paymentController;
