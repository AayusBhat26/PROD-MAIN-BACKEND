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
    const user = await prisma.User.create({
      data:{
        email, name, about, profilePicture,
      }
    })
    return res.json({
      message:"Success", 
      status:true,
      user
    })
  } catch (error) {
    
  }
}

export const getAllUsers = async (req,res,next)=>{
  try {
    const prisma  = getPrismaInstance();
    const users = await prisma.User.findMany({
      orderBy:{name:"asc"}, 
      select:{
        id:true, 
        email:true,
        name:true, 
        profilePicture:true, 
        about:true,
      }
    });
    // grouping all the  users by the initials
    const usersGroupByInitialLetter = {};

    users.forEach((user)=>{
      const initialLetter = user.name.charAt(0).toUpperCase();
      if(!usersGroupByInitialLetter[initialLetter]){
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });
    return res.status(200).send({users:usersGroupByInitialLetter})
  } catch (error) {
    next(error)
  }
}









// agar error baar baar aate jate toh ek baar prisma ko regenerate krwa dena 
// npx prisma generate