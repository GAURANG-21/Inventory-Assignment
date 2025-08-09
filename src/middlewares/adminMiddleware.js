export const adminAccessibility = (req, res, next) => {
  try {
    if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Forbidden: Admin access required." });
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ message: "Server error during authorization check." });
  }
};
