import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'bookings.db');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Initialize SQLite Database
const db = new Database(dbPath, { verbose: console.log });

// Create bookings table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    guests INTEGER NOT NULL,
    room_type TEXT NOT NULL,
    event_type TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Mock WhatsApp Notification
const sendWhatsAppNotification = (booking) => {
  console.log('--------------------------------------------------');
  console.log(`[MOCK WHATSAPP API] Message Sent to ${booking.phone}`);
  console.log(`Hello ${booking.name}, your request for a ${booking.room_type} at Green Haven Village Resort (Check-in: ${booking.check_in}, Check-out: ${booking.check_out}) via ${booking.payment_method} has been received.`);
  console.log('--------------------------------------------------');
};

// API Endpoint to receive booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, email, guests, roomType, eventType, checkIn, checkOut, paymentMethod } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (name, phone, email, guests, room_type, event_type, check_in, check_out, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(name, phone, email, guests, roomType, eventType, checkIn, checkOut, paymentMethod);
    
    // Send mock whatsapp
    sendWhatsAppNotification({
        name, phone, room_type: roomType, check_in: checkIn, check_out: checkOut, payment_method: paymentMethod
    });

    res.status(201).json({ success: true, bookingId: info.lastInsertRowid });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
