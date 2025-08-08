import jwt from "jsonwebtoken";

export const generateAccessToken = async (payload) => {
  const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return accessToken;
};

export const generateRefreshToken = async (payload) => {
  const refreshToken = await jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return refreshToken;
};
