import getPrismaInstance from "../utils/PrismaClient.js"

export const addMessage = async (req,res,next)=>{
      try {
            // console.log("inside try block");
            const prisma  = getPrismaInstance()
            const {message, from, to } = req.body;
            console.log(message, from, to);
            const getUser = onlineUsers.get(to);
            if(message && from  && to ){
                  const newMessage = await prisma.Messages.create({
                    data: {
                      message,
                      sender: { connect: { id: from } },
                      reciever: { connect: { id: to } },
                      messageStatus: getUser ? "delivered" : "sent",
                    },
                    include: { sender: true, reciever: true },
                  });
                  return res.status(201).send({message:newMessage})
            }
            return res.status(400).send("From, to and message is required.");
      } catch (error) {
            return res.status(400).json({
                  message:error.message,
            })
            next(error)
      }
}
// getting all the messages.
export const getMessages = async(req,res,next)=>{
      try {
            const prisma  = getPrismaInstance();
            const {from, to } = req.params;
            const messages = await prisma.messages.findMany({
              where: {
                OR: [
                  {
                    senderId: from,
                    recieverId: to,
                  },
                  {
                    senderId: to,
                    recieverId: from,
                  },
                ],
              },
              orderBy: {
                id: "asc",
              },
            });
            // const messages = await prisma.Messages.find({
            //   $or: [
            //     {
            //       senderId: { $eq: from },
            //       recieverId: { $eq: to },
            //     },
            //     {
            //       senderId: { $eq: to },
            //       recieverId: { $eq: from },
            //     },
            //   ],
            // });
            // unread messages

            const unreadMessages=[];
            messages.forEach((message,index)=>{
                  if (
                    message.messageStatus !== "read" &&
                    message.senderId === to
                  ) {
                    messages[index].messageStatus = "read";
                    unreadMessages.push(message.id);
                  } 
            }
            )
            await prisma.Messages.updateMany({
                  where:{
                        id:{in:unreadMessages }
                  },data:{
                        messageStatus:'read',
                  }
            });
            return res.status(200).json({
                  messages
            })
      } catch (error) {
            next(error);
      }
}