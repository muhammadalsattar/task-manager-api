const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

const validator = (value) => {
  if (value.length < 6) {
    throw new Error("Password must be greater than 6 characters");
  }
  if (value.includes("password")) {
    throw new Error("Password invalid!");
  }
};

const userSchema = new Schema(
  {
    email:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: validator,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar:{
        type: Buffer
    }
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
