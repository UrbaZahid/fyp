const mongoose = require('mongoose');
require('dotenv').config();

const User     = require('./models/User');
const Provider = require('./models/Provider');

const fix = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Saare provider users dhoondo
  const providerUsers = await User.find({ role: 'provider' });
  console.log(`Found ${providerUsers.length} provider user(s)`);

  for (const user of providerUsers) {
    const existing = await Provider.findOne({ user: user._id });
    if (!existing) {
      await Provider.create({
        user:         user._id,
        serviceAreas: [],
        isApproved:   user.isApproved || false,
      });
      console.log(`✅ Provider document banaya: ${user.name} (${user.email})`);
    } else {
      console.log(`⏭️  Already exists: ${user.name} — isApproved: ${existing.isApproved}`);
      
      // Sync isApproved between User and Provider
      if (existing.isApproved !== user.isApproved) {
        existing.isApproved = user.isApproved;
        await existing.save();
        console.log(`   🔄 isApproved synced to: ${user.isApproved}`);
      }
    }
  }

  console.log('\n🎉 Fix complete!');
  process.exit(0);
};

fix().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});