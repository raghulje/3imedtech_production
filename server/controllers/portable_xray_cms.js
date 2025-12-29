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
  const hero = await db.PortableXRayHero.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', hero || {});
});

const upsertHero = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated Portable X-Ray Hero';
  
  const existing = await db.PortableXRayHero.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('portable-xray-hero', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.PortableXRayHero.create(payload);
  await saveVersion('portable-xray-hero', null, created.toJSON(), userId, 'Created Portable X-Ray Hero');
  return status.responseStatus(res, 201, 'Created', created);
});

const softDeleteHero = asyncHandler(async (req, res) => {
  const hero = await db.PortableXRayHero.findOne({ where: { isDeleted: false } });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  const userId = req.userData?.id || null;
  const oldData = hero.toJSON();
  await saveVersion('portable-xray-hero', null, oldData, userId, 'Soft deleted Portable X-Ray Hero');
  
  hero.isDeleted = true;
  hero.deletedAt = new Date();
  await hero.save();
  
  return status.responseStatus(res, 200, "Deleted");
});

const restoreHero = asyncHandler(async (req, res) => {
  const hero = await db.PortableXRayHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  hero.isDeleted = false;
  hero.deletedAt = null;
  await hero.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('portable-xray-hero', null, hero.toJSON(), userId, 'Restored Portable X-Ray Hero');
  
  return status.responseStatus(res, 200, "Restored", hero);
});

// Products CRUD
const listProducts = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const where = includeDeleted ? {} : { isDeleted: false };
  const products = await db.PortableXRayProduct.findAll({ 
    where,
    order: [['order', 'ASC']] 
  });
  return status.responseStatus(res, 200, 'OK', products);
});

const createProduct = asyncHandler(async (req, res) => {
  const userId = req.userData?.id || null;
  const product = await db.PortableXRayProduct.create(req.body);
  await saveVersion('portable-xray-product', product.id, product.toJSON(), userId, 'Created Portable X-Ray Product');
  return status.responseStatus(res, 201, 'Created', product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.PortableXRayProduct.findByPk(id);
  if (!product || product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  const changeDescription = req.body.changeDescription || 'Updated Portable X-Ray Product';
  await saveVersion('portable-xray-product', product.id, oldData, userId, changeDescription);
  
  await product.update(req.body);
  await product.reload(); // Reload to get the latest data
  return status.responseStatus(res, 200, 'Updated', product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.PortableXRayProduct.findByPk(id);
  if (!product) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  if (product.isDeleted) {
    return status.responseStatus(res, 400, 'Product is already deleted');
  }
  
  const userId = req.userData?.id || null;
  const oldData = product.toJSON();
  await saveVersion('portable-xray-product', product.id, oldData, userId, 'Soft deleted Portable X-Ray Product');
  
  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();
  
  // Reload to ensure the changes are persisted
  await product.reload();
  
  return status.responseStatus(res, 200, 'Deleted', product);
});

const restoreProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.PortableXRayProduct.findByPk(id);
  if (!product || !product.isDeleted) {
    return status.responseStatus(res, 404, 'Product not found');
  }
  
  product.isDeleted = false;
  product.deletedAt = null;
  await product.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('portable-xray-product', product.id, product.toJSON(), userId, 'Restored Portable X-Ray Product');
  
  return status.responseStatus(res, 200, 'Restored', product);
});

// Overview Section
const getOverview = asyncHandler(async (req, res) => {
  const overview = await db.PortableXRayOverview.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', overview || {});
});

const upsertOverview = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated Portable X-Ray Overview';
  
  const existing = await db.PortableXRayOverview.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('portable-xray-overview', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.PortableXRayOverview.create(payload);
  await saveVersion('portable-xray-overview', null, created.toJSON(), userId, 'Created Portable X-Ray Overview');
  return status.responseStatus(res, 201, 'Created', created);
});

// Features CRUD
const listFeatures = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const where = includeDeleted ? {} : { isDeleted: false };
  const features = await db.PortableXRayFeature.findAll({ 
    where,
    order: [['order', 'ASC']] 
  });
  return status.responseStatus(res, 200, 'OK', features);
});

const createFeature = asyncHandler(async (req, res) => {
  const userId = req.userData?.id || null;
  const feature = await db.PortableXRayFeature.create(req.body);
  await saveVersion('portable-xray-feature', feature.id, feature.toJSON(), userId, 'Created Portable X-Ray Feature');
  return status.responseStatus(res, 201, 'Created', feature);
});

const updateFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const feature = await db.PortableXRayFeature.findByPk(id);
  if (!feature || feature.isDeleted) {
    return status.responseStatus(res, 404, 'Feature not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = feature.toJSON();
  const changeDescription = req.body.changeDescription || 'Updated Portable X-Ray Feature';
  await saveVersion('portable-xray-feature', feature.id, oldData, userId, changeDescription);
  
  await feature.update(req.body);
  return status.responseStatus(res, 200, 'Updated', feature);
});

const deleteFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const feature = await db.PortableXRayFeature.findByPk(id);
  if (!feature || feature.isDeleted) {
    return status.responseStatus(res, 404, 'Feature not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = feature.toJSON();
  await saveVersion('portable-xray-feature', feature.id, oldData, userId, 'Soft deleted Portable X-Ray Feature');
  
  feature.isDeleted = true;
  feature.deletedAt = new Date();
  await feature.save();
  
  return status.responseStatus(res, 200, 'Deleted');
});

// Specifications CRUD
const listSpecifications = asyncHandler(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const where = includeDeleted ? {} : { isDeleted: false };
  const specifications = await db.PortableXRaySpecification.findAll({ 
    where,
    order: [['order', 'ASC']] 
  });
  return status.responseStatus(res, 200, 'OK', specifications);
});

const createSpecification = asyncHandler(async (req, res) => {
  const userId = req.userData?.id || null;
  const specification = await db.PortableXRaySpecification.create(req.body);
  await saveVersion('portable-xray-specification', specification.id, specification.toJSON(), userId, 'Created Portable X-Ray Specification');
  return status.responseStatus(res, 201, 'Created', specification);
});

const updateSpecification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const specification = await db.PortableXRaySpecification.findByPk(id);
  if (!specification || specification.isDeleted) {
    return status.responseStatus(res, 404, 'Specification not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = specification.toJSON();
  const changeDescription = req.body.changeDescription || 'Updated Portable X-Ray Specification';
  await saveVersion('portable-xray-specification', specification.id, oldData, userId, changeDescription);
  
  await specification.update(req.body);
  return status.responseStatus(res, 200, 'Updated', specification);
});

const deleteSpecification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const specification = await db.PortableXRaySpecification.findByPk(id);
  if (!specification || specification.isDeleted) {
    return status.responseStatus(res, 404, 'Specification not found');
  }
  
  const userId = req.userData?.id || null;
  const oldData = specification.toJSON();
  await saveVersion('portable-xray-specification', specification.id, oldData, userId, 'Soft deleted Portable X-Ray Specification');
  
  specification.isDeleted = true;
  specification.deletedAt = new Date();
  await specification.save();
  
  return status.responseStatus(res, 200, 'Deleted');
});

module.exports = {
  hero: {
    get: getHero,
    upsert: upsertHero,
    softDelete: softDeleteHero,
    restore: restoreHero,
  },
  overview: {
    get: getOverview,
    upsert: upsertOverview,
  },
  features: {
    list: listFeatures,
    create: createFeature,
    update: updateFeature,
    delete: deleteFeature,
  },
  specifications: {
    list: listSpecifications,
    create: createSpecification,
    update: updateSpecification,
    delete: deleteSpecification,
  },
  products: {
    list: listProducts,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    restore: restoreProduct,
    permanentDelete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await db.PortableXRayProduct.findByPk(id);
      if (!product) {
        return status.responseStatus(res, 404, 'Product not found');
      }
      
      const userId = req.userData?.id || null;
      await saveVersion('portable-xray-product', product.id, product.toJSON(), userId, 'Permanently deleted Portable X-Ray Product');
      
      await product.destroy();
      
      return status.responseStatus(res, 200, 'Permanently deleted');
    }),
  },
};

