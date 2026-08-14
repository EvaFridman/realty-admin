const PDFDocument = require('pdfkit');
const path = require('path');

const FONT_PATH = path.join(__dirname, '..', '..', 'fonts', 'DejaVuSans.ttf');

function streamListingCard(stream, listing) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);
  doc.font(FONT_PATH);

  doc.fontSize(20).text(listing.title);
  doc.moveDown();
  doc.fontSize(12).text(`Цена: ${listing.price} ₽`);
  doc.text(`Площадь: ${listing.area} м²`);
  doc.text(`Район: ${listing.district ? listing.district.title : '—'}`);
  doc.text(`Адрес: ${listing.address}`);
  doc.text(`Агент: ${listing.agent ? listing.agent.name : '—'}`);

  if (listing.description) {
    doc.moveDown();
    doc.text(listing.description);
  }

  doc.end();
}

function streamListingsBundle(stream, listings) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);
  doc.font(FONT_PATH);

  doc.fontSize(20).text('Подборка объявлений');
  doc.fontSize(12).text(`Всего объявлений: ${listings.length}`);
  doc.moveDown();
  listings.forEach((listing, index) => {
    doc.text(`${index + 1}. ${listing.title} — ${listing.price} ₽`);
  });

  listings.forEach((listing) => {
    doc.addPage();
    doc.fontSize(18).text(listing.title);
    doc.moveDown();
    doc.fontSize(12).text(`Цена: ${listing.price} ₽`);
    doc.text(`Площадь: ${listing.area} м²`);
    doc.text(`Район: ${listing.district ? listing.district.title : '—'}`);
    doc.text(`Адрес: ${listing.address}`);
  });

  doc.end();
}

module.exports = { streamListingCard, streamListingsBundle };