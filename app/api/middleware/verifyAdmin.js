const verifyAdmin = (req, res, next) => {
    console.log('Verifying admin role...');
    if (req.user.role !== 'admin') {
      console.log('Not an admin');
      return res.status(403).json({ message: "Access Denied: Admins only" });
    }
    console.log('Admin verified');
    next();
  };
  
  export default verifyAdmin;
  