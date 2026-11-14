const { connectDB, disconnectDB } = require('../config/db');
const { seedInitialData } = require('../utils/seedData');

const runSeed = async () => {
  try {
    console.log('🚀 [Seed Script] Connecting to database...');
    await connectDB();
    await seedInitialData();
    console.log('🎉 [Seed Script] Seed process completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Script Error]', error);
    process.exit(1);
  }
};

runSeed();

