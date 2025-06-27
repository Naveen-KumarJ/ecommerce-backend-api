const authorizer = (roles) => {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) next();
    else {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
  };
};

module.exports = authorizer;
