/**
 * MoMo Payment Server (Node.js + Express)
 * Chạy: node momo-server.js
 * Port: 3030
 *
 * Test credentials (MoMo Sandbox):
 *   https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
 *   Partner Code : MOMO
 *   Access Key   : F8BBA842ECF85
 *   Secret Key   : K951B6PE1waDMi640xX08PD3vg6EkVlz
 */

const express = require('express');
const crypto  = require('crypto');
const https   = require('https');
const cors    = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:4200', 'http://localhost:4000'] }));

// ─── MoMo config (sandbox) ────────────────────────────────────────────────────
const MOMO_PARTNER_CODE = 'MOMO';
const MOMO_ACCESS_KEY   = 'F8BBA842ECF85';
const MOMO_SECRET_KEY   = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_ENDPOINT     = 'https://test-payment.momo.vn';
const MOMO_PATH         = '/v2/gateway/api/create';
const REQUEST_TYPE      = 'payWithMethod';
// ──────────────────────────────────────────────────────────────────────────────

/**
 * POST /momo/create-payment
 * Body: { orderId, amount, orderInfo, customerName, customerPhone, redirectUrl, ipnUrl }
 */
app.post('/momo/create-payment', (req, res) => {
  const {
    orderId,
    amount,
    orderInfo,
    customerName,
    customerPhone,
    redirectUrl = 'http://localhost:4200/ex-momo/result',
    ipnUrl      = 'http://localhost:3030/momo/ipn'
  } = req.body;

  if (!orderId || !amount || !orderInfo) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: orderId, amount, orderInfo' });
  }

  const requestId   = `${orderId}_${Date.now()}`;
  const extraData   = Buffer.from(JSON.stringify({ name: customerName, phone: customerPhone })).toString('base64');
  const autoCapture = true;
  const lang        = 'vi';

  // Build raw signature string
  const rawSignature =
    `accessKey=${MOMO_ACCESS_KEY}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${MOMO_PARTNER_CODE}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${REQUEST_TYPE}`;

  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: MOMO_PARTNER_CODE,
    accessKey:   MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType:  REQUEST_TYPE,
    signature,
    lang,
    autoCapture
  });

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: MOMO_PATH,
    method: 'POST',
    headers: {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const momoReq = https.request(options, (momoRes) => {
    let data = '';
    momoRes.on('data', (chunk) => { data += chunk; });
    momoRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('[MoMo Response]', parsed);

        if (parsed.resultCode === 0) {
          res.json({ payUrl: parsed.payUrl, orderId });
        } else {
          res.status(400).json({
            message: parsed.message || 'MoMo trả về lỗi',
            resultCode: parsed.resultCode
          });
        }
      } catch (e) {
        res.status(500).json({ message: 'Lỗi parse response từ MoMo' });
      }
    });
  });

  momoReq.on('error', (e) => {
    console.error('[MoMo Request Error]', e);
    res.status(500).json({ message: 'Không kết nối được tới MoMo: ' + e.message });
  });

  momoReq.write(requestBody);
  momoReq.end();
});

/**
 * POST /momo/ipn  – MoMo gọi về để xác nhận giao dịch (IPN hook)
 */
app.post('/momo/ipn', (req, res) => {
  const body = req.body;
  console.log('[MoMo IPN]', body);

  // Verify signature
  const rawSignature =
    `accessKey=${MOMO_ACCESS_KEY}` +
    `&amount=${body.amount}` +
    `&extraData=${body.extraData}` +
    `&message=${body.message}` +
    `&orderId=${body.orderId}` +
    `&orderInfo=${body.orderInfo}` +
    `&orderType=${body.orderType}` +
    `&partnerCode=${body.partnerCode}` +
    `&payType=${body.payType}` +
    `&requestId=${body.requestId}` +
    `&responseTime=${body.responseTime}` +
    `&resultCode=${body.resultCode}` +
    `&transId=${body.transId}`;

  const expectedSig = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  if (expectedSig === body.signature) {
    console.log(`[IPN] Đơn hàng ${body.orderId} – resultCode=${body.resultCode}`);
    // TODO: cập nhật trạng thái đơn hàng trong DB
  } else {
    console.warn('[IPN] Chữ ký không khớp!');
  }

  res.status(204).send();
});

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`\n✅  MoMo server đang chạy tại http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/momo/create-payment`);
  console.log(`   POST http://localhost:${PORT}/momo/ipn\n`);
});
