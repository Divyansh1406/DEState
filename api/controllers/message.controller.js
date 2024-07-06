import prisma from "../lib/prisma.js";

// Add a message to the specified chat
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const { chatId } = req.params;
  const { text } = req.body;

  try {
    // Check if the user is part of the chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: { has: tokenUserId },
      },
    });

    if (!chat) {
      return res
        .status(404)
        .json({ error: "Chat not found or user not authorized" });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        text,
        userId: tokenUserId,
        chatId,
      },
    });

    // Update the last message in the chat
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessage: message.text },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};
