import cron from "node-cron";
import User from "../models/User.model.js"

export const scheduleUserDeletionJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const hundredDaysAgo = new Date();
      hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

      const inactiveUsers = await User.find({
        role: { $ne: "guest" },
        lastLogin: { $lt: hundredDaysAgo },
      });

      if (inactiveUsers.length > 0) {
        for (const user of inactiveUsers) {
          await User.findByIdAndDelete(user._id);
          console.log(`Deleted user: ${user.username}`);
        }
      }
    } catch (error) {
      console.error("Error deleting inactive users:", error);
    }
  });
};
