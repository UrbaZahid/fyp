// backend/seedAreas.js
// Run karo: node seedAreas.js
// Yeh script Gujranwala ke areas MongoDB mein add karta hai

const mongoose = require('mongoose');
require('dotenv').config();

const ServiceArea = require('./models/ServiceArea');

const gujranwalaAreas = [
  { name: 'Satellite Town',    city: 'Gujranwala' },
  { name: 'Model Town',        city: 'Gujranwala' },
  { name: 'Civil Lines',       city: 'Gujranwala' },
  { name: 'WAPDA Town',        city: 'Gujranwala' },
  { name: 'Citi Housing',      city: 'Gujranwala' },
  { name: 'DHA Gujranwala',    city: 'Gujranwala' },
  { name: 'DC Colony',         city: 'Gujranwala' },
  { name: 'Garden Town',       city: 'Gujranwala' },
  { name: 'Master City',       city: 'Gujranwala' },
  { name: 'Peoples Colony',    city: 'Gujranwala' },
  { name: 'Shaheen Orchard',   city: 'Gujranwala' },
  { name: 'Shahi Bazaar',      city: 'Gujranwala' },
  { name: 'Gujranwala Cantt',  city: 'Gujranwala' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    for (const area of gujranwalaAreas) {
      const exists = await ServiceArea.findOne({ name: area.name });
      if (!exists) {
        await ServiceArea.create({ ...area, isActive: true });
        console.log(`➕ Added: ${area.name}`);
      } else {
        console.log(`⏭️  Already exists: ${area.name}`);
      }
    }

    console.log('\n🎉 Areas seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();