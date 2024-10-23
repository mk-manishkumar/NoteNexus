import cron from "node-cron";

// Schedule job to delete inactive users
export const scheduleUserDeletionJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const currentDate = new Date();
      const hundredDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 100));

      const inactiveUsers = await userModel.find({
        role: { $ne: "guest" },
        lastLogin: { $lt: hundredDaysAgo },
      });

      if (inactiveUsers.length > 0) {
        for (const user of inactiveUsers) {
          await userModel.findByIdAndDelete(user._id);
          console.log(`Deleted user: ${user.username}`);
        }
      }
    } catch (error) {
      console.error("Error deleting inactive users:", error);
    }
  });
};
