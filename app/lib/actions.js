"use server";

import { revalidatePath } from "next/cache";
import { User } from "./model";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../ui/auth";
export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    //   destructure out items
    Object.fromEntries(formData);
  // create newuser and add it to mongoDb
  try {
    connectToDB();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });
    await newUser.save();
  } catch (error) {
    console.log(err);
    throw new Error("Failed to create user!");
  }
  //   update userList
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    //   destructure out items
    Object.fromEntries(formData);
  // create newuser and add it to mongoDb
  try {
    connectToDB();
    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive,
    };
    Object.keys(updateFields).forEach(
      (key) =>
        updateFields[key] === "" || (undefined && delete updateFields[key])
    );
    await User.findByIdAndUpdate(id, updateFields);
  } catch (error) {
    console.log(err);
    throw new Error("Failed to update user!");
  }
  //   update userList
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
export const deleteUser = async (formData) => {
  const { id } =
    //   destructure out items
    Object.fromEntries(formData);
  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (error) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }
  //   update userList
  revalidatePath("/dashboard/users");
};

export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    // credentials is provider name
    await signIn("credentials", { username, password });
  } catch (err) {
    return "Wrong Credentials";
  }
};
