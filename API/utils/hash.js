import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
    
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      throw new Error("فشل في تشفير كلمة المرور");
    }
  };
  

  export const comparePassword = async (password, hashedPassword) => {
    try {
     
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error("فشل في مقارنة كلمة المرور");
    }
  };