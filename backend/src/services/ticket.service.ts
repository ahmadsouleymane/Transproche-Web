import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { Ticket } from '../models/Ticket';
import { AppException } from '../middlewares/error.middleware';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const ticketService = {
  /**
   * Generate QR code as base64 data URL
   */
  async generateQRCode(reservationNumber: string): Promise<string> {
    const ticketUrl = `${FRONTEND_URL}/ticket/verify/${reservationNumber}`;

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(ticketUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      return qrCodeDataUrl;
    } catch (error) {
      throw new AppException('Erreur lors de la génération du QR code', 500);
    }
  },

  /**
   * Generate QR code as buffer
   */
  async generateQRCodeBuffer(reservationNumber: string): Promise<Buffer> {
    const ticketUrl = `${FRONTEND_URL}/ticket/verify/${reservationNumber}`;

    try {
      const buffer = await QRCode.toBuffer(ticketUrl, {
        width: 200,
        margin: 2,
      });
      return buffer;
    } catch (error) {
      throw new AppException('Erreur lors de la génération du QR code', 500);
    }
  },

  /**
   * Generate PDF ticket
   */
  async generatePDF(reservationNumber: string): Promise<Buffer> {
    const ticket = await Ticket.findOne({ reservationNumber })
      .populate('company', 'name logo phone address')
      .populate('trip', 'departure arrival departureTime')
      .populate('user', 'name email phone');

    if (!ticket) {
      throw new AppException('Réservation non trouvée', 404);
    }

    const qrCodeBuffer = await this.generateQRCodeBuffer(reservationNumber);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const trip = ticket.trip as any;
      const company = ticket.company as any;
      const user = ticket.user as any;

      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a56db')
        .text('TRANSPROCHE', { align: 'center' });
      doc.fontSize(12).font('Helvetica').fillColor('#666')
        .text('Votre partenaire de voyage', { align: 'center' });

      doc.moveDown(2);

      // Ticket title
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000')
        .text('TICKET DE VOYAGE', { align: 'center' });

      doc.moveDown(1);

      // Divider
      doc.strokeColor('#e5e7eb').lineWidth(1)
        .moveTo(50, doc.y).lineTo(545, doc.y).stroke();

      doc.moveDown(1);

      // Reservation number box
      doc.rect(150, doc.y, 295, 40).fill('#f3f4f6');
      doc.fillColor('#000').fontSize(12).font('Helvetica')
        .text('N° de réservation:', 160, doc.y + 5);
      doc.fontSize(16).font('Helvetica-Bold')
        .text(ticket.reservationNumber, 160, doc.y + 20);

      doc.moveDown(4);

      // Two columns layout
      const leftCol = 50;
      const rightCol = 300;
      let currentY = doc.y;

      // Company info (left)
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('COMPAGNIE', leftCol, currentY);
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000')
        .text(company.name, leftCol, currentY + 15);
      if (company.phone) {
        doc.fontSize(10).font('Helvetica').fillColor('#666')
          .text(`Tél: ${company.phone}`, leftCol, currentY + 35);
      }

      // Passenger info (right)
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('PASSAGER', rightCol, currentY);
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000')
        .text(ticket.passengerInfo.name, rightCol, currentY + 15);
      doc.fontSize(10).font('Helvetica').fillColor('#666')
        .text(`Tél: ${ticket.passengerInfo.phone}`, rightCol, currentY + 35);

      currentY += 70;

      // Divider
      doc.strokeColor('#e5e7eb').lineWidth(1)
        .moveTo(50, currentY).lineTo(545, currentY).stroke();

      currentY += 20;

      // Trip details
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('TRAJET', leftCol, currentY);

      currentY += 20;

      // Departure
      doc.fontSize(12).font('Helvetica').fillColor('#666')
        .text('Départ', leftCol, currentY);
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000')
        .text(trip.departure, leftCol, currentY + 15);

      // Arrow
      doc.fontSize(24).fillColor('#1a56db')
        .text('→', 220, currentY + 10);

      // Arrival
      doc.fontSize(12).font('Helvetica').fillColor('#666')
        .text('Arrivée', rightCol, currentY);
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000')
        .text(trip.arrival, rightCol, currentY + 15);

      currentY += 60;

      // Date and time row
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('DATE', leftCol, currentY);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('HEURE', 180, currentY);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#666')
        .text('PLACES', rightCol, currentY);

      currentY += 15;

      const travelDate = new Date(ticket.travelDate);
      const dateStr = travelDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
        .text(dateStr, leftCol, currentY);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
        .text(trip.departureTime, 180, currentY);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
        .text(`${ticket.seats} place(s)`, rightCol, currentY);

      currentY += 40;

      // Divider
      doc.strokeColor('#e5e7eb').lineWidth(1)
        .moveTo(50, currentY).lineTo(545, currentY).stroke();

      currentY += 20;

      // Price section
      doc.rect(50, currentY, 495, 50).fill('#f0fdf4');
      doc.fontSize(14).font('Helvetica').fillColor('#166534')
        .text('MONTANT TOTAL', 60, currentY + 10);
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#166534')
        .text(`${ticket.totalPrice.toLocaleString('fr-FR')} FCFA`, 60, currentY + 25);

      // Payment status
      const statusColors: Record<string, string> = {
        'en_attente': '#f59e0b',
        'paye_livraison': '#3b82f6',
        'confirme': '#22c55e',
        'annule': '#ef4444',
        'expire': '#6b7280',
      };
      const statusLabels: Record<string, string> = {
        'en_attente': 'En attente',
        'paye_livraison': 'Paiement à la livraison',
        'confirme': 'Confirmé',
        'annule': 'Annulé',
        'expire': 'Expiré',
      };

      doc.fontSize(10).font('Helvetica-Bold')
        .fillColor(statusColors[ticket.status] || '#666')
        .text(statusLabels[ticket.status] || ticket.status, 400, currentY + 18);

      currentY += 70;

      // QR Code section
      doc.fontSize(10).font('Helvetica').fillColor('#666')
        .text('Scannez ce QR code pour vérifier votre ticket:', { align: 'center' });

      currentY = doc.y + 10;

      // Add QR code image
      doc.image(qrCodeBuffer, (doc.page.width - 150) / 2, currentY, {
        width: 150,
        height: 150,
      });

      currentY += 170;

      // Footer
      doc.fontSize(8).font('Helvetica').fillColor('#666')
        .text('Ce ticket est valable uniquement pour la date et l\'heure indiquées.', 50, currentY, { align: 'center' });
      doc.text('Présentez ce ticket (imprimé ou sur mobile) lors de l\'embarquement.', { align: 'center' });
      doc.moveDown(1);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' });

      doc.end();
    });
  },

  /**
   * Get ticket with QR code
   */
  async getTicketWithQR(reservationNumber: string) {
    const ticket = await Ticket.findOne({ reservationNumber })
      .populate('company', 'name logo phone address')
      .populate('trip', 'departure arrival departureTime')
      .populate('user', 'name email phone');

    if (!ticket) {
      throw new AppException('Réservation non trouvée', 404);
    }

    const qrCode = await this.generateQRCode(reservationNumber);

    return {
      ...ticket.toObject(),
      qrCode,
    };
  },
};
