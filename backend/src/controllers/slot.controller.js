import DeliverySlot from '../models/deliverySlot.model.js';

export const inMemorySlots = [
  {
    _id: 'slot_geetham_1',
    restaurantId: 'rest_geetham_navalur',
    date: 'Today',
    startTime: '12:00',
    endTime: '13:00',
    maxOrders: 20,
    currentOrders: 0,
    isAvailable: true
  },
  {
    _id: 'slot_geetham_2',
    restaurantId: 'rest_geetham_navalur',
    date: 'Today',
    startTime: '13:00',
    endTime: '14:00',
    maxOrders: 20,
    currentOrders: 0,
    isAvailable: true
  },
  {
    _id: 'slot_geetham_3',
    restaurantId: 'rest_geetham_navalur',
    date: 'Today',
    startTime: '19:00',
    endTime: '20:00',
    maxOrders: 20,
    currentOrders: 0,
    isAvailable: true
  },
  {
    _id: 'slot_geetham_4',
    restaurantId: 'rest_geetham_navalur',
    date: 'Today',
    startTime: '20:00',
    endTime: '21:00',
    maxOrders: 20,
    currentOrders: 0,
    isAvailable: true
  }
];

// GET /api/slots?restaurantId=...&date=...
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { restaurantId, date } = req.query;

    try {
      const query = { isAvailable: true };
      if (restaurantId) query.restaurantId = restaurantId;
      if (date) query.date = date;

      const slots = await DeliverySlot.find(query).lean();
      const availableSlots = slots.filter((slot) => slot.currentOrders < slot.maxOrders);
      if (availableSlots.length > 0) {
        return res.json({ success: true, data: availableSlots });
      }
    } catch (dbErr) {}

    // In-memory fallback
    let filtered = inMemorySlots.filter((s) => s.isAvailable && s.currentOrders < s.maxOrders);
    if (restaurantId) {
      filtered = filtered.filter((s) => s.restaurantId.toString() === restaurantId.toString());
    }
    if (date) {
      filtered = filtered.filter((s) => s.date === date);
    }
    res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/slots
export const createSlot = async (req, res, next) => {
  try {
    const { restaurantId, date, startTime, endTime, maxOrders } = req.body;
    const newSlot = {
      _id: `slot_${Date.now()}`,
      restaurantId,
      date,
      startTime,
      endTime,
      maxOrders: maxOrders || 10,
      currentOrders: 0,
      isAvailable: true
    };

    try {
      const slot = await DeliverySlot.create(newSlot);
      inMemorySlots.push(slot.toObject());
      return res.status(201).json({ success: true, data: slot });
    } catch (dbErr) {
      inMemorySlots.push(newSlot);
      return res.status(201).json({ success: true, data: newSlot });
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/slots/:restaurantId
export const getAdminSlots = async (req, res, next) => {
  try {
    try {
      const slots = await DeliverySlot.find({ restaurantId: req.params.restaurantId }).sort({ date: 1, startTime: 1 }).lean();
      if (slots.length > 0) return res.json({ success: true, data: slots });
    } catch (dbErr) {}

    const filtered = inMemorySlots.filter((s) => s.restaurantId.toString() === req.params.restaurantId.toString());
    res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/slots/:id/toggle
export const toggleSlotAvailability = async (req, res, next) => {
  try {
    try {
      const slot = await DeliverySlot.findById(req.params.id);
      if (slot) {
        slot.isAvailable = !slot.isAvailable;
        await slot.save();
        return res.json({ success: true, data: slot });
      }
    } catch (dbErr) {}

    const slot = inMemorySlots.find((s) => s._id.toString() === req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Delivery slot not found', code: 'NOT_FOUND' });
    }
    slot.isAvailable = !slot.isAvailable;
    res.json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};
