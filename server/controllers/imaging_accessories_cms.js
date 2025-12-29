const db = require('../models');
const status = require('../helpers/response');
const versionControl = require('./version_control');

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, 'Internal error', { error: e.message }));
}

// Helper to save version before update
async function saveVersion(sectionType, sectionId, oldData, userId, changeDescription) {
  try {
    if (oldData) {
      await versionControl.createVersion(sectionType, sectionId, oldData, userId, changeDescription);
    }
  } catch (error) {
    console.error('Error saving version:', error);
  }
}

// Hero Section
const getHero = asyncHandler(async (req, res) => {
  const hero = await db.ImagingAccessoriesHero.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', hero || {});
});

const upsertHero = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated Imaging Accessories Hero';
  
  const existing = await db.ImagingAccessoriesHero.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('imaging-accessories-hero', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.ImagingAccessoriesHero.create(payload);
  await saveVersion('imaging-accessories-hero', null, created.toJSON(), userId, 'Created Imaging Accessories Hero');
  return status.responseStatus(res, 201, 'Created', created);
});

const softDeleteHero = asyncHandler(async (req, res) => {
  const hero = await db.ImagingAccessoriesHero.findOne({ where: { isDeleted: false } });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  const userId = req.userData?.id || null;
  const oldData = hero.toJSON();
  await saveVersion('imaging-accessories-hero', null, oldData, userId, 'Soft deleted Imaging Accessories Hero');
  
  hero.isDeleted = true;
  hero.deletedAt = new Date();
  await hero.save();
  
  return status.responseStatus(res, 200, "Deleted");
});

const restoreHero = asyncHandler(async (req, res) => {
  const hero = await db.ImagingAccessoriesHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  hero.isDeleted = false;
  hero.deletedAt = null;
  await hero.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('imaging-accessories-hero', null, hero.toJSON(), userId, 'Restored Imaging Accessories Hero');
  
  return status.responseStatus(res, 200, "Restored", hero);
});

// Products CRUD
const listProducts = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const where = includeDeleted ? {} : { isDeleted: false };
  const products = await db.ImagingAccessoriesProduct.findAll({ 
    where,
    order: [['order', 'ASC']] 
  });
  return status.responseStatus(res, 200, 'OK', products);
});

const createProduct = asyncHandler(async (req, res) => {
  const userId = req.userData?.id || null;
  const product = await db.ImagingAccessoriesProduct.create(req.body);
  await saveVersion('imaging-accessories-product', product.id, product.toJSON(), userId, 'Created Imaging Accessories Product');
  return status.responseStatus(res, 201, 'Created', product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.ImagingAccessoriesProduct.findByPk(id);
  if (!product || product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  const changeDescription = req.body.changeDescription || 'Updated Imaging Accessories Product';
  await saveVersion('imaging-accessories-product', product.id, oldData, userId, changeDescription);
  
  await product.update(req.body);
  await product.reload(); // Reload to get the latest data
  return status.responseStatus(res, 200, 'Updated', product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.ImagingAccessoriesProduct.findByPk(id);
  if (!product || product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  await saveVersion('imaging-accessories-product', product.id, oldData, userId, 'Soft deleted Imaging Accessories Product');
  
  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();
  
  return status.responseStatus(res, 200, 'Deleted');
});

const restoreProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.ImagingAccessoriesProduct.findByPk(id);
  if (!product || !product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  product.isDeleted = false;
  product.deletedAt = null;
  await product.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('imaging-accessories-product', product.id, product.toJSON(), userId, 'Restored Imaging Accessories Product');
  
  return status.responseStatus(res, 200, 'Restored', product);
});

const permanentDeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.ImagingAccessoriesProduct.findByPk(id);
  if (!product) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  await saveVersion('imaging-accessories-product', product.id, product.toJSON(), userId, 'Permanently deleted Imaging Accessories Product');
  
  await product.destroy();
  
  return status.responseStatus(res, 200, 'Permanently deleted');
});

module.exports = {
  hero: {
    get: getHero,
    upsert: upsertHero,
    softDelete: softDeleteHero,
    restore: restoreHero,
  },
  products: {
    list: listProducts,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    restore: restoreProduct,
    permanentDelete: permanentDeleteProduct,
  },
};
