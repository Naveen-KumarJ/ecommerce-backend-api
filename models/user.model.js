const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        required: false,
        default: "",
      },
      landmark: {
        type: String,
        required: false,
        default: "",
      },
      city: {
        type: String,
        requried: true,
      },
      state: {
        type: String,
        requried: true,
      },
      pincode: {
        type: String,
        requried: true,
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["CUSTOMER", "SELLER", "ADMIN"],
    },
    jwt: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  console.log(this.password);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
