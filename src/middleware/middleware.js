import jwt from 'jsonwebtoken'



export const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = decodedToken(token);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = decoded; 

    console.log(decoded, 'ok lets do somethings');
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};




export const isAdmin = (req, res, next) => {
    if (req?.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    next();
  };

  

  export const isAgent = (req, res, next) => {
    if (req.user.role !== "agent") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Agents only.",
      });
    }
    next();
  };

  



  export const isUser = (req, res, next) => {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Users only.",
      });
    }
    next();
  };



export const decodedToken = (token) => {
  try {
    return jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
  } catch (error) {
    return null;
  }
};
