import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('./public/brochure.pdf'));

doc.fontSize(25)
   .text('Shashi Kumar Resort', 100, 100);

doc.fontSize(15)
   .text('Premier Destination for Weddings and Celebrations', 100, 150);

doc.fontSize(12)
   .text('Experience the perfect blend of village charm and modern luxury.', 100, 200);

doc.text('Features:', 100, 240);
doc.list([
  'Premium Duplex Rooms',
  'Infinity Pool',
  '10k sqft Event Space',
  'Over 500+ Guest Capacity for Weddings',
  'Box Cricket & Activities'
], 120, 260);

doc.text('Contact Us:', 100, 400);
doc.text('Phone: +91 7569262463', 100, 420);
doc.text('Email: shashikumar@gmail.com', 100, 440);
doc.text('Location: Hanmakonda Room', 100, 460);

doc.end();
console.log('PDF Generated Successfully at public/brochure.pdf');
