
export const isAdmin = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not the admin" });
    }
    next();
  };
  