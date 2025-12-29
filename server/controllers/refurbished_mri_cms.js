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
  const hero = await db.RefurbishedMRIHero.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', hero || {});
});

const upsertHero = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated Refurbished MRI Hero';
  
  const existing = await db.RefurbishedMRIHero.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('refurbished-mri-hero', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.RefurbishedMRIHero.create(payload);
  await saveVersion('refurbished-mri-hero', null, created.toJSON(), userId, 'Created Refurbished MRI Hero');
  return status.responseStatus(res, 201, 'Created', created);
});

const softDeleteHero = asyncHandler(async (req, res) => {
  const hero = await db.RefurbishedMRIHero.findOne({ where: { isDeleted: false } });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  const userId = req.userData?.id || null;
  const oldData = hero.toJSON();
  await saveVersion('refurbished-mri-hero', null, oldData, userId, 'Soft deleted Refurbished MRI Hero');
  
  hero.isDeleted = true;
  hero.deletedAt = new Date();
  await hero.save();
  
  return status.responseStatus(res, 200, "Deleted");
});

const restoreHero = asyncHandler(async (req, res) => {
  const hero = await db.RefurbishedMRIHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  hero.isDeleted = false;
  hero.deletedAt = null;
  await hero.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('refurbished-mri-hero', null, hero.toJSON(), userId, 'Restored Refurbished MRI Hero');
  
  return status.responseStatus(res, 200, "Restored", hero);
});

// Products CRUD
const listProducts = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const where = includeDeleted ? {} : { isDeleted: false };
  const products = await db.RefurbishedMRIProduct.findAll({ 
    where,
    order: [['order', 'ASC']] 
  });
  return status.responseStatus(res, 200, 'OK', products);
});

const createProduct = asyncHandler(async (req, res) => {
  const userId = req.userData?.id || null;
  const product = await db.RefurbishedMRIProduct.create(req.body);
  await saveVersion('refurbished-mri-product', product.id, product.toJSON(), userId, 'Created Refurbished MRI Product');
  return status.responseStatus(res, 201, 'Created', product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.RefurbishedMRIProduct.findByPk(id);
  if (!product || product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  const changeDescription = req.body.changeDescription || 'Updated Refurbished MRI Product';
  await saveVersion('refurbished-mri-product', product.id, oldData, userId, changeDescription);
  
  await product.update(req.body);
  return status.responseStatus(res, 200, 'Updated', product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.RefurbishedMRIProduct.findByPk(id);
  if (!product || product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  await saveVersion('refurbished-mri-product', product.id, oldData, userId, 'Soft deleted Refurbished MRI Product');
  
  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();
  
  return status.responseStatus(res, 200, 'Deleted');
});

const restoreProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.RefurbishedMRIProduct.findByPk(id);
  if (!product || !product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  product.isDeleted = false;
  product.deletedAt = null;
  await product.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('refurbished-mri-product', product.id, product.toJSON(), userId, 'Restored Refurbished MRI Product');
  
  return status.responseStatus(res, 200, 'Restored', product);
});

const permanentDeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.RefurbishedMRIProduct.findByPk(id);
  if (!product) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  await saveVersion('refurbished-mri-product', product.id, product.toJSON(), userId, 'Permanently deleted Refurbished MRI Product');
  
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

