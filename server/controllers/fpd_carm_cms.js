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
  const hero = await db.FPDCArmHero.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', hero || {});
});

const upsertHero = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated FPD C-ARM Hero';
  
  const existing = await db.FPDCArmHero.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('fpd-carm-hero', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.FPDCArmHero.create(payload);
  await saveVersion('fpd-carm-hero', null, created.toJSON(), userId, 'Created FPD C-ARM Hero');
  return status.responseStatus(res, 201, 'Created', created);
});

const softDeleteHero = asyncHandler(async (req, res) => {
  const hero = await db.FPDCArmHero.findOne({ where: { isDeleted: false } });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  const userId = req.userData?.id || null;
  const oldData = hero.toJSON();
  await saveVersion('fpd-carm-hero', null, oldData, userId, 'Soft deleted FPD C-ARM Hero');
  
  hero.isDeleted = true;
  hero.deletedAt = new Date();
  await hero.save();
  
  return status.responseStatus(res, 200, "Deleted");
});

const restoreHero = asyncHandler(async (req, res) => {
  const hero = await db.FPDCArmHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
  if (!hero) return status.responseStatus(res, 404, "Not found");
  
  hero.isDeleted = false;
  hero.deletedAt = null;
  await hero.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('fpd-carm-hero', null, hero.toJSON(), userId, 'Restored FPD C-ARM Hero');
  
  return status.responseStatus(res, 200, "Restored", hero);
});

// Content Section
const getContent = asyncHandler(async (req, res) => {
  const content = await db.FPDCArmContent.findOne({ where: { isDeleted: false } });
  return status.responseStatus(res, 200, 'OK', content || {});
});

const upsertContent = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated FPD C-ARM Content';
  
  const existing = await db.FPDCArmContent.findOne({ where: { isDeleted: false } });
  if (existing) {
    const oldData = existing.toJSON();
    await saveVersion('fpd-carm-content', null, oldData, userId, changeDescription);
    await existing.update(payload);
    return status.responseStatus(res, 200, 'Updated', existing);
  }
  const created = await db.FPDCArmContent.create(payload);
  await saveVersion('fpd-carm-content', null, created.toJSON(), userId, 'Created FPD C-ARM Content');
  return status.responseStatus(res, 201, 'Created', created);
});

const softDeleteContent = asyncHandler(async (req, res) => {
  const content = await db.FPDCArmContent.findOne({ where: { isDeleted: false } });
  if (!content) return status.responseStatus(res, 404, "Not found");
  
  const userId = req.userData?.id || null;
  const oldData = content.toJSON();
  await saveVersion('fpd-carm-content', null, oldData, userId, 'Soft deleted FPD C-ARM Content');
  
  content.isDeleted = true;
  content.deletedAt = new Date();
  await content.save();
  
  return status.responseStatus(res, 200, "Deleted");
});

const restoreContent = asyncHandler(async (req, res) => {
  const content = await db.FPDCArmContent.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
  if (!content) return status.responseStatus(res, 404, "Not found");
  
  content.isDeleted = false;
  content.deletedAt = null;
  await content.save();
  
  const userId = req.userData?.id || null;
  await saveVersion('fpd-carm-content', null, content.toJSON(), userId, 'Restored FPD C-ARM Content');
  
  return status.responseStatus(res, 200, "Restored", content);
});

module.exports = {
  hero: {
    get: getHero,
    upsert: upsertHero,
    softDelete: softDeleteHero,
    restore: restoreHero,
  },
  content: {
    get: getContent,
    upsert: upsertContent,
    softDelete: softDeleteContent,
    restore: restoreContent,
  },
};

