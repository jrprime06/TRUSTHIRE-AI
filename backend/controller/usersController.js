// backend/controllers/usersController.js

const users = []; // temporary storage (hackathon safe)

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const alreadyExists = users.find(u => u.email === email);
  if (alreadyExists) {
    return res.status(409).json({ message: "User already registered" });
  }

  users.push({ name, email, password });

  res.status(201).json({
    message: "Registration successful",
    user: { name, email }
  });
};