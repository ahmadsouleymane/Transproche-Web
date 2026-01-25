import nodemailer from 'nodemailer';
import { ticketService } from './ticket.service';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@transproche.com';
const FROM_NAME = process.env.FROM_NAME || 'Transproche';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw - email failure shouldn't break the main flow
  }
}

export const emailService = {
  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(ticket: any): Promise<void> {
    const trip = ticket.trip;
    const company = ticket.company;
    const travelDate = new Date(ticket.travelDate);

    const qrCode = await ticketService.generateQRCode(ticket.reservationNumber);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TRANSPROCHE</h1>
        <p style="color: #93c5fd; margin: 5px 0 0 0; font-size: 14px;">Votre partenaire de voyage</p>
      </td>
    </tr>

    <!-- Success Banner -->
    <tr>
      <td style="background-color: #dcfce7; padding: 20px; text-align: center; border-bottom: 3px solid #22c55e;">
        <p style="color: #166534; margin: 0; font-size: 18px; font-weight: bold;">
          ✓ Réservation confirmée !
        </p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
          Bonjour <strong>${ticket.passengerInfo.name}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0;">
          Votre réservation a été enregistrée avec succès. Voici les détails de votre voyage :
        </p>

        <!-- Reservation Number Box -->
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase;">Numéro de réservation</p>
          <p style="color: #1a56db; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${ticket.reservationNumber}</p>
        </div>

        <!-- Trip Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 15px; background-color: #fafafa; border-radius: 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="45%" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">DÉPART</p>
                    <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">${trip.departure}</p>
                  </td>
                  <td width="10%" style="text-align: center;">
                    <span style="color: #1a56db; font-size: 24px;">→</span>
                  </td>
                  <td width="45%" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">ARRIVÉE</p>
                    <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">${trip.arrival}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Details Grid -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td width="50%" style="padding: 10px 10px 10px 0;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">DATE</p>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0;">
                ${travelDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </td>
            <td width="50%" style="padding: 10px 0 10px 10px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">HEURE</p>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0;">${trip.departureTime}</p>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding: 10px 10px 10px 0;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">COMPAGNIE</p>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0;">${company.name}</p>
            </td>
            <td width="50%" style="padding: 10px 0 10px 10px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">PLACES</p>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0;">${ticket.seats} place(s)</p>
            </td>
          </tr>
        </table>

        <!-- Price Box -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
          <p style="color: #166534; font-size: 12px; margin: 0 0 5px 0;">MONTANT TOTAL</p>
          <p style="color: #166534; font-size: 28px; font-weight: bold; margin: 0;">${ticket.totalPrice.toLocaleString('fr-FR')} FCFA</p>
          <p style="color: #22c55e; font-size: 12px; margin: 10px 0 0 0;">Paiement à la livraison</p>
        </div>

        <!-- QR Code -->
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
            Présentez ce QR code lors de l'embarquement :
          </p>
          <img src="${qrCode}" alt="QR Code" style="width: 180px; height: 180px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background-color: #fff;">
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${FRONTEND_URL}/client/bookings" style="display: inline-block; background-color: #1a56db; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Voir mes réservations
          </a>
        </div>

        <!-- Download Link -->
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${FRONTEND_URL}/api/tickets/${ticket.reservationNumber}/pdf" style="color: #1a56db; font-size: 14px;">
            📄 Télécharger le ticket PDF
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; text-align: center;">
          Ce ticket est valable uniquement pour la date et l'heure indiquées.
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 20px 0; text-align: center;">
          Arrivez au moins 30 minutes avant le départ.
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} Transproche. Tous droits réservés.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail({
      to: ticket.user?.email || ticket.passengerInfo.email,
      subject: `Confirmation de réservation - ${ticket.reservationNumber}`,
      html,
    });
  },

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(ticket: any): Promise<void> {
    const trip = ticket.trip;
    const travelDate = new Date(ticket.travelDate);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TRANSPROCHE</h1>
      </td>
    </tr>

    <tr>
      <td style="background-color: #fef2f2; padding: 20px; text-align: center; border-bottom: 3px solid #ef4444;">
        <p style="color: #991b1b; margin: 0; font-size: 18px; font-weight: bold;">
          ✕ Réservation annulée
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding: 30px;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
          Bonjour <strong>${ticket.passengerInfo.name}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0;">
          Votre réservation <strong>${ticket.reservationNumber}</strong> a été annulée.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">TRAJET ANNULÉ</p>
          <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">
            ${trip.departure} → ${trip.arrival}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
            ${travelDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à ${trip.departureTime}
          </p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0;">
          Si vous avez effectué un paiement, vous serez remboursé dans les plus brefs délais.
        </p>

        <div style="text-align: center;">
          <a href="${FRONTEND_URL}/search" style="display: inline-block; background-color: #1a56db; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Réserver un nouveau voyage
          </a>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} Transproche. Tous droits réservés.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail({
      to: ticket.user?.email || ticket.passengerInfo.email,
      subject: `Annulation de réservation - ${ticket.reservationNumber}`,
      html,
    });
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TRANSPROCHE</h1>
      </td>
    </tr>

    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #111827; font-size: 20px; margin: 0 0 20px 0;">
          Réinitialisation de mot de passe
        </h2>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0;">
          Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
        </p>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #1a56db; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Réinitialiser mon mot de passe
          </a>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
          Ce lien expirera dans 1 heure.
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} Transproche. Tous droits réservés.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Transproche',
      html,
    });
  },

  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(user: any): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TRANSPROCHE</h1>
        <p style="color: #93c5fd; margin: 5px 0 0 0; font-size: 14px;">Votre partenaire de voyage</p>
      </td>
    </tr>

    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">
          Bienvenue ${user.name} ! 🎉
        </h2>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px 0;">
          Votre compte Transproche a été créé avec succès. Vous pouvez maintenant réserver vos tickets de bus facilement.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #111827; font-size: 16px; margin: 0 0 15px 0;">Avec Transproche, vous pouvez :</h3>
          <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Rechercher et comparer les trajets</li>
            <li style="margin-bottom: 10px;">Réserver vos tickets en quelques clics</li>
            <li style="margin-bottom: 10px;">Recevoir vos tickets par email</li>
            <li style="margin-bottom: 10px;">Envoyer des colis partout au Niger</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${FRONTEND_URL}/search" style="display: inline-block; background-color: #1a56db; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Réserver mon premier voyage
          </a>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
          © ${new Date().getFullYear()} Transproche. Tous droits réservés.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Bienvenue sur Transproche !',
      html,
    });
  },
};
