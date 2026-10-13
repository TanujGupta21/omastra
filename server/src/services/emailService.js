const transporter = require('../config/email');

const isEmailConfigured = () => {
  return (
    process.env.SMTP_PASS &&
    process.env.SMTP_PASS !== 'placeholder' &&
    process.env.SMTP_USER &&
    process.env.SMTP_USER !== 'placeholder@brevo.com'
  );
};

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

exports.sendOrderConfirmation = async (order, user) => {
  if (!isEmailConfigured()) {
    console.log('[Email] Not configured — skipping order confirmation email for order', order.orderNumber);
    return;
  }
  const email = user?.email || order.guestEmail;
  if (!email) return;

  const itemRows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #30352F">${i.productName}${i.variantFlavor ? ` — ${i.variantFlavor}` : ''}${i.variantSize ? ` (${i.variantSize})` : ''}</td>
        <td style="padding:8px 0;border-bottom:1px solid #30352F;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #30352F;text-align:right">${formatINR(i.lineTotal)}</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#1B1F1B;color:#F4F4EE;padding:32px;border-radius:8px">
      <h1 style="color:#C6FF3D;font-size:24px;margin-bottom:4px">OMASTRA</h1>
      <p style="color:#A8ADA5;margin-top:0">Power Within.</p>
      <hr style="border-color:#30352F;margin:24px 0">
      <h2 style="font-size:20px">Order Confirmed! 🎉</h2>
      <p>Hi ${user?.name || 'there'},</p>
      <p>Thank you for your order. We've received it and will start processing shortly.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">
        <thead>
          <tr style="color:#A8ADA5;font-size:12px;text-transform:uppercase">
            <th style="text-align:left;padding:8px 0">Product</th>
            <th style="text-align:center;padding:8px 0">Qty</th>
            <th style="text-align:right;padding:8px 0">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="text-align:right">
        <p>Subtotal: ${formatINR(order.subtotal)}</p>
        ${order.discount > 0 ? `<p style="color:#C6FF3D">Discount: -${formatINR(order.discount)}</p>` : ''}
        <p>Shipping: ${order.shippingCharge === 0 ? 'Free' : formatINR(order.shippingCharge)}</p>
        <p style="font-size:18px;font-weight:bold">Total: ${formatINR(order.total)}</p>
      </div>
      <hr style="border-color:#30352F;margin:24px 0">
      <p style="color:#A8ADA5;font-size:12px">© 2025 OMASTRA. This is a demo/development email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Order Confirmed — ${order.orderNumber} | OMASTRA`,
      html,
    });
    console.log('[Email] Order confirmation sent to', email);
  } catch (err) {
    console.error('[Email] Failed to send order confirmation:', err.message);
    throw err;
  }
};

exports.sendWelcomeEmail = async (user) => {
  if (!isEmailConfigured()) return;
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Welcome to OMASTRA',
      html: `<div style="font-family:Inter,sans-serif;color:#111311;padding:32px">
        <h1 style="color:#111311">Welcome, ${user.name}!</h1>
        <p>You're now part of the OMASTRA community. Power within — let's get to work.</p>
        <a href="${process.env.CLIENT_URL}/shop" style="display:inline-block;background:#C6FF3D;color:#111311;font-weight:bold;padding:12px 24px;border-radius:6px;text-decoration:none">Shop Now</a>
      </div>`,
    });
  } catch (err) {
    console.error('[Email] Welcome email failed:', err.message);
  }
};
