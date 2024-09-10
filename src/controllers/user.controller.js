import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/User.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // chech if user already exists: username, email

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // request for files

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coveImageLocalPath = req.files?.coverImage[0]?.path;

  // check for images, check for avatar
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary , avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coveImageLocalPath);

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered succsessully"));
})

export {
  registerUser,
}