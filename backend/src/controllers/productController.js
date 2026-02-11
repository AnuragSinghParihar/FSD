const db = require('../config/db');

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    const { category, search, sort, order, page, limit, minPrice, maxPrice } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.deleted_at IS NULL';
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    const validSorts = ['price', 'name', 'created_at', 'rating'];
    const sortBy = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortBy} ${sortOrder}`;

    const pageNum = parseInt(page) || 1;
    const pageSize = Math.min(parseInt(limit) || 12, 50);
    const offset = (pageNum - 1) * pageSize;
    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [products] = await db.execute(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.deleted_at IS NULL';
    const countParams = [];
    if (category) { countQuery += ' AND c.slug = ?'; countParams.push(category); }
    if (search) { countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }
    if (minPrice) { countQuery += ' AND p.price >= ?'; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countQuery += ' AND p.price <= ?'; countParams.push(parseFloat(maxPrice)); }

    const [countResult] = await db.execute(countQuery, countParams);

    res.json({
      products,
      pagination: { page: pageNum, limit: pageSize, total: countResult[0].total, pages: Math.ceil(countResult[0].total / pageSize) }
    });
  } catch (error) { next(error); }
};

// GET /api/products/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.deleted_at IS NULL`,
      [req.params.slug]
    );
    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });

    const [reviews] = await db.execute(
      `SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10`,
      [products[0].id]
    );
    res.json({ product: { ...products[0], reviews } });
  } catch (error) { next(error); }
};

// GET /api/products/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE featured = TRUE AND deleted_at IS NULL LIMIT 8');
    res.json({ products });
  } catch (error) { next(error); }
};

// POST /api/products (admin only)
exports.create = async (req, res, next) => {
  try {
    const { name, category_id, description, price, compare_price, stock, image_url, featured } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result] = await db.execute(
      'INSERT INTO products (name, slug, category_id, description, price, compare_price, stock, image_url, featured) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, slug, category_id || null, description || '', price, compare_price || null, stock || 0, image_url || '', featured || false]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId, slug });
  } catch (error) { next(error); }
};

// PUT /api/products/:id (admin only)
exports.update = async (req, res, next) => {
  try {
    const { name, category_id, description, price, compare_price, stock, image_url, featured } = req.body;
    const fields = [];
    const params = [];

    if (name) { fields.push('name = ?, slug = ?'); params.push(name, name.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }
    if (category_id !== undefined) { fields.push('category_id = ?'); params.push(category_id); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (price !== undefined) { fields.push('price = ?'); params.push(price); }
    if (compare_price !== undefined) { fields.push('compare_price = ?'); params.push(compare_price); }
    if (stock !== undefined) { fields.push('stock = ?'); params.push(stock); }
    if (image_url !== undefined) { fields.push('image_url = ?'); params.push(image_url); }
    if (featured !== undefined) { fields.push('featured = ?'); params.push(featured); }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    await db.execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Product updated' });
  } catch (error) { next(error); }
};

// DELETE /api/products/:id (admin - soft delete)
exports.remove = async (req, res, next) => {
  try {
    await db.execute('UPDATE products SET deleted_at = NOW() WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) { next(error); }
};

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    res.json({ categories });
  } catch (error) { next(error); }
};
