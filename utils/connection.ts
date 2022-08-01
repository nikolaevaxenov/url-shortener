import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_URI;

export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const LinkSchema = new mongoose.Schema({
    username: {
      type: String,
      default: "Guest",
    },
    shortLink: {
      type: String,
      unique: true,
    },
    fullLink: String,
    expiryDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
  });

  const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);

  return { conn, Link };
};
