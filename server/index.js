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
    status TEXT DEFAULT 'New Inquiry',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add status column to existing table if it doesn't exist
try {
  db.exec(`ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'New Inquiry'`);
} catch (error) {
  // If it fails, it likely already exists, which is fine.
}

// Mock WhatsApp Notification
const sendWhatsAppNotification = (booking) => {
  console.log('--------------------------------------------------');
  console.log(`[MOCK WHATSAPP API] Message Sent to ${booking.phone}`);
  console.log(`Hello ${booking.name}, your request for a ${booking.room_type} at Green Haven Village Resort (Check-in: ${booking.check_in}, Check-out: ${booking.check_out}) via ${booking.payment_method} has been received.`);
  console.log('--------------------------------------------------');
};

// --- Admin API Endpoints ---

// Get all bookings
app.get('/api/admin/bookings', (req, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Update booking status
app.patch('/api/admin/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// --- Public Endpoints ---

// API Endpoint to receive booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, email, guests, roomType, eventType, checkIn, checkOut, paymentMethod } = req.body;
  
  // Basic mock assumption: if they paid by card/UPI, status is Advance Paid. Otherwise New Inquiry.
  const initialStatus = paymentMethod ? 'Advance Paid' : 'New Inquiry';

  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (name, phone, email, guests, room_type, event_type, check_in, check_out, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(name, phone, email, guests, roomType, eventType, checkIn, checkOut, paymentMethod, initialStatus);
    
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
