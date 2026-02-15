const db = require('../config/db');

// POST /api/orders (checkout)
exports.checkout = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { address, city, postal_code, phone } = req.body;
    if (!address || !city || !postal_code) {
      return res.status(400).json({ error: 'Address, city, and postal code required' });
    }

    // Get cart items
    const [cartItems] = await conn.execute(
      `SELECT c.*, p.price, p.stock, p.name
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.deleted_at IS NULL`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total > 500 ? 0 : 49;
    const orderTotal = total + shipping;

    // Create order
    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, total, address, city, postal_code, phone) VALUES (?,?,?,?,?,?)',
      [req.user.id, orderTotal, address, city, postal_code, phone || '']
    );

    // Create order items and update stock
    for (const item of cartItems) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        [orderResult.insertId, item.product_id, item.quantity, item.price]
      );
      await conn.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await conn.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    res.status(201).json({
      message: 'Order placed successfully',
      order: { id: orderResult.insertId, total: orderTotal, status: 'pending' }
    });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

// GET /api/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, GROUP_CONCAT(oi.product_id) as product_ids
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.execute(
        `SELECT oi.*, p.name, p.slug, p.image_url
         FROM order_items oi JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ orders });
  } catch (error) { next(error); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.slug, p.image_url
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: { ...orders[0], items } });
  } catch (error) { next(error); }
};
