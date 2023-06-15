import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({
        message: "email is required",
        status: false,
      });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.User.findUnique({
     where:{email}
    });
    if(!user){
      return res.json({
        message: "user not found",
        status: false,
      })
    }
    else{
      return res.json({
            message:"user found", 
            status:true,
            data:user
      })
    }
  } catch (error) {
    next(error);
  }
};
export const onBoardUser = async (req,res,next)=>{
  try {
    const {email, name, about, image:profilePicture} =  req.body;
    if(!email || !name ||!profilePicture){
      return res.send("email, name and image are required")
    }
    const prisma  = getPrismaInstance()
    await prisma.User.create({
      data:{
        email, name, about, profilePicture,
      }
    })
    return res.json({
      message:"Success", 
      status:true,
    })
  } catch (error) {
    
  }
}









// agar error baar baar aate jate toh ek baar prisma ko regenerate krwa dena 
// npx prisma generate