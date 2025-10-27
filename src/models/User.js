import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  exam: { type: String, required: true },
  full: { type: Number, required: true },
  pass: { type: Number, required: true },
  obtain: { type: Number, required: true },
});

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    picture: { type: String },
    lastLogin: { type: Date, default: Date.now },

    // ✅ Role section
    role: {
      type: String,
      enum: ["Student", "Teacher", ""],
      default: "Student",
    },

    // ✅ Courses enrolled (for Students)
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId }],
     deletedAt: {type: Date,default: null}

    // ✅ Student result & personal details grouped here
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
