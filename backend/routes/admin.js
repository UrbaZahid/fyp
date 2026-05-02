// // routes/admin.js

// const express   = require('express');
// const router    = express.Router();
// const User      = require('../models/User');
// const Provider  = require('../models/Provider');
// const Booking   = require('../models/booking');
// const Payment   = require('../models/Payment');
// const ServiceCategory = require('../models/ServiceCategory');
// const ServiceArea     = require('../models/ServiceArea');
// const { protect, authorize } = require('../middleware/auth');

// // Shortcut — har route admin only hai
// // Toh yeh middleware ek baar define karke reuse karte hain
// const adminOnly = [protect, authorize('admin')];

// // ════════════════════════════════════════
// // DASHBOARD STATS
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/stats ─────────────────────────────
// // @desc    Admin dashboard ke liye overall stats
// // @access  Admin only
// router.get('/stats', adminOnly, async (req, res) => {
//   try {
//     // Sab counts ek saath fetch karo (fast!)
//     const [
//       totalUsers,
//       totalProviders,
//       totalBookings,
//       pendingProviders,
//       pendingBookings,
//       completedBookings,
//       payments,
//     ] = await Promise.all([
//       User.countDocuments({ role: 'customer' }),
//       User.countDocuments({ role: 'provider' }),
//       Booking.countDocuments(),
//       User.countDocuments({ role: 'provider', isApproved: false }),
//       Booking.countDocuments({ status: 'Pending' }),
//       Booking.countDocuments({ status: 'Completed' }),
//       Payment.find({ status: 'completed' }),
//     ]);

//     // Total revenue calculate karo
//     const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

//     res.json({
//       totalUsers,
//       totalProviders,
//       totalBookings,
//       pendingProviders,   // Approval pending providers
//       pendingBookings,    // Pending booking requests
//       completedBookings,
//       totalRevenue,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // USERS MANAGEMENT
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/users ─────────────────────────────
// router.get('/users', adminOnly, async (req, res) => {
//   try {
//     const users = await User.find({ role: 'customer' })
//       .select('-password')
//       .sort({ createdAt: -1 });

//     res.json({ users });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ─── @route  DELETE /api/admin/users/:id ──────────────────────
// router.delete('/users/:id', adminOnly, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // PROVIDERS MANAGEMENT
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/providers ─────────────────────────
// router.get('/providers', adminOnly, async (req, res) => {
//   try {
//     const providers = await Provider.find()
//       .populate('user', 'name email phone isApproved createdAt')
//       .populate('category', 'name')
//       .sort({ createdAt: -1 });

//     res.json({ providers });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ─── @route  PUT /api/admin/providers/:id/approve ─────────────
// // @desc    Provider ko approve karo
// router.put('/providers/:id/approve', adminOnly, async (req, res) => {
//   try {
//     // Provider ki User record update karo
//     const provider = await Provider.findById(req.params.id);
//     if (!provider) {
//       return res.status(404).json({ message: 'Provider not found' });
//     }

//     // User mein isApproved true karo
//     await User.findByIdAndUpdate(provider.user, { isApproved: true });

//     // Provider model mein bhi true karo
//     provider.isApproved = true;
//     await provider.save();

//     res.json({ message: 'Provider approved successfully! ✅' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ─── @route  PUT /api/admin/providers/:id/reject ──────────────
// // @desc    Provider ko reject karo
// router.put('/providers/:id/reject', adminOnly, async (req, res) => {
//   try {
//     const provider = await Provider.findById(req.params.id);
//     if (!provider) {
//       return res.status(404).json({ message: 'Provider not found' });
//     }

//     await User.findByIdAndUpdate(provider.user, { isApproved: false });
//     provider.isApproved = false;
//     await provider.save();

//     res.json({ message: 'Provider rejected' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ─── @route  DELETE /api/admin/providers/:id ──────────────────
// router.delete('/providers/:id', adminOnly, async (req, res) => {
//   try {
//     const provider = await Provider.findByIdAndDelete(req.params.id);
//     if (provider) {
//       // User bhi delete karo
//       await User.findByIdAndDelete(provider.user);
//     }
//     res.json({ message: 'Provider deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // BOOKINGS MANAGEMENT
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/bookings ──────────────────────────
// router.get('/bookings', adminOnly, async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('customer', 'name email')
//       .populate({
//         path: 'provider',
//         populate: { path: 'user', select: 'name email' },
//       })
//       .sort({ createdAt: -1 });

//     res.json({ bookings });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // PAYMENTS / TRANSACTIONS
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/transactions ──────────────────────
// router.get('/transactions', adminOnly, async (req, res) => {
//   try {
//     const transactions = await Payment.find({ status: 'completed' })
//       .populate('customer', 'name email')
//       .populate('booking')
//       .sort({ createdAt: -1 });

//     res.json({ transactions });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // REPORTS
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/reports ───────────────────────────
// router.get('/reports', adminOnly, async (req, res) => {
//   try {
//     const [
//       totalBookings,
//       pendingBookings,
//       acceptedBookings,
//       completedBookings,
//       rejectedBookings,
//       payments,
//       topProviders,
//     ] = await Promise.all([
//       Booking.countDocuments(),
//       Booking.countDocuments({ status: 'Pending' }),
//       Booking.countDocuments({ status: 'Accepted' }),
//       Booking.countDocuments({ status: 'Completed' }),
//       Booking.countDocuments({ status: 'Rejected' }),
//       Payment.find({ status: 'completed' }),

//       // Top 5 providers by total bookings
//       Booking.aggregate([
//         { $group: { _id: '$provider', totalBookings: { $sum: 1 } } },
//         { $sort: { totalBookings: -1 } },
//         { $limit: 5 },
//         {
//           $lookup: {
//             from: 'providers',
//             localField: '_id',
//             foreignField: '_id',
//             as: 'provider',
//           },
//         },
//       ]),
//     ]);

//     const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

//     res.json({
//       bookingSummary: {
//         total:     totalBookings,
//         pending:   pendingBookings,
//         accepted:  acceptedBookings,
//         completed: completedBookings,
//         rejected:  rejectedBookings,
//       },
//       revenue: {
//         total:          totalRevenue,
//         totalPayments:  payments.length,
//       },
//       topProviders,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ════════════════════════════════════════
// // CATEGORIES & AREAS (Admin Control)
// // ════════════════════════════════════════

// // ─── @route  GET /api/admin/categories ────────────────────────
// router.get('/categories', adminOnly, async (req, res) => {
//   try {
//     const categories = await ServiceCategory.find().sort({ createdAt: -1 });
//     res.json({ categories });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // ─── @route  GET /api/admin/areas ─────────────────────────────
// router.get('/areas', adminOnly, async (req, res) => {
//   try {
//     const areas = await ServiceArea.find().sort({ createdAt: -1 });
//     res.json({ areas });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;
// routes/admin.js

const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');
const Provider  = require('../models/Provider');
const Booking   = require('../models/booking');
const Payment   = require('../models/Payment');
const ServiceCategory = require('../models/ServiceCategory');
const ServiceArea     = require('../models/ServiceArea');
const { protect, authorize } = require('../middleware/auth');

// Shortcut — har route admin only hai
// Toh yeh middleware ek baar define karke reuse karte hain
const adminOnly = [protect, authorize('admin')];

// ════════════════════════════════════════
// DASHBOARD STATS
// ════════════════════════════════════════

// ─── @route  GET /api/admin/public-stats ──────────────────────
// @desc    Public stats for the home page (no auth required)
// Returns: verified provider count, completed bookings, registered customers
router.get('/public-stats', async (req, res) => {
  try {
    const [providers, completedBookings, customers] = await Promise.all([
      User.countDocuments({ role: 'provider' }),
      Booking.countDocuments({ status: 'Completed' }),
      User.countDocuments({ role: 'customer' }),
    ]);
    res.json({ providers, completedBookings, customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/admin/stats ─────────────────────────────
// @desc    Admin dashboard ke liye overall stats
// @access  Admin only
router.get('/stats', adminOnly, async (req, res) => {
  try {
    // Sab counts ek saath fetch karo (fast!)
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      pendingProviders,
      pendingBookings,
      completedBookings,
      payments,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'provider' }),
      Booking.countDocuments(),
      User.countDocuments({ role: 'provider', isApproved: false }),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Completed' }),
      Payment.find({ status: 'completed' }),
    ]);

    // Total revenue calculate karo
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      pendingProviders,   // Approval pending providers
      pendingBookings,    // Pending booking requests
      completedBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// USERS MANAGEMENT
// ════════════════════════════════════════

// ─── @route  GET /api/admin/users ─────────────────────────────
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  DELETE /api/admin/users/:id ──────────────────────
router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// PROVIDERS MANAGEMENT
// ════════════════════════════════════════

// ─── @route  GET /api/admin/providers ─────────────────────────
router.get('/providers', adminOnly, async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('user', 'name email phone isApproved createdAt')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({ providers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/admin/providers/:id/approve ─────────────
// @desc    Provider ko approve karo
router.put('/providers/:id/approve', adminOnly, async (req, res) => {
  try {
    // Provider ki User record update karo
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // User mein isApproved true karo
    await User.findByIdAndUpdate(provider.user, { isApproved: true });

    // Provider model mein bhi true karo
    provider.isApproved = true;
    await provider.save();

    res.json({ message: 'Provider approved successfully! ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/admin/providers/:id/reject ──────────────
// @desc    Provider ko reject karo
router.put('/providers/:id/reject', adminOnly, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    await User.findByIdAndUpdate(provider.user, { isApproved: false });
    provider.isApproved = false;
    await provider.save();

    res.json({ message: 'Provider rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  DELETE /api/admin/providers/:id ──────────────────
router.delete('/providers/:id', adminOnly, async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (provider) {
      // User bhi delete karo
      await User.findByIdAndDelete(provider.user);
    }
    res.json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// BOOKINGS MANAGEMENT
// ════════════════════════════════════════

// ─── @route  GET /api/admin/bookings ──────────────────────────
router.get('/bookings', adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// PAYMENTS / TRANSACTIONS
// ════════════════════════════════════════

// ─── @route  GET /api/admin/transactions ──────────────────────
router.get('/transactions', adminOnly, async (req, res) => {
  try {
    const transactions = await Payment.find({ status: 'completed' })
      .populate('customer', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// REPORTS
// ════════════════════════════════════════

// ─── @route  GET /api/admin/reports ───────────────────────────
router.get('/reports', adminOnly, async (req, res) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      acceptedBookings,
      completedBookings,
      rejectedBookings,
      payments,
      topProviders,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Accepted' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Rejected' }),
      Payment.find({ status: 'completed' }),

      // Top 5 providers by total bookings — populate user name
      Booking.aggregate([
        { $group: { _id: '$provider', totalBookings: { $sum: 1 } } },
        { $sort: { totalBookings: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'providers',
            localField: '_id',
            foreignField: '_id',
            as: 'provider',
          },
        },
        { $unwind: { path: '$provider', preserveNullAndEmpty: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'provider.user',
            foreignField: '_id',
            as: 'providerUser',
          },
        },
        { $unwind: { path: '$providerUser', preserveNullAndEmpty: true } },
        {
          $project: {
            totalBookings: 1,
            'provider.name': '$providerUser.name',
            'provider.email': '$providerUser.email',
          },
        },
      ]),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      bookingSummary: {
        total:     totalBookings,
        pending:   pendingBookings,
        accepted:  acceptedBookings,
        completed: completedBookings,
        rejected:  rejectedBookings,
      },
      revenue: {
        total:         totalRevenue,
        totalPayments: payments.length,
      },
      topProviders: topProviders.map(p => ({
        totalBookings: p.totalBookings,
        provider: [{ user: { name: p.provider?.name || 'Unknown', email: p.provider?.email || '' } }],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ════════════════════════════════════════
// CATEGORIES & AREAS (Admin Control)
// ════════════════════════════════════════

// ─── @route  GET /api/admin/categories ────────────────────────
router.get('/categories', adminOnly, async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/admin/areas ─────────────────────────────
router.get('/areas', adminOnly, async (req, res) => {
  try {
    const areas = await ServiceArea.find().sort({ createdAt: -1 });
    res.json({ areas });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;