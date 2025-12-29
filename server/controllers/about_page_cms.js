const { AboutHero, AboutContent, AboutRedefiningHealthcare, AboutRefexGroup } = require("../models");
const status = require("../helpers/response");
const versionControl = require("./version_control");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
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
exports.hero = {
  get: asyncHandler(async (req, res) => {
    const hero = await AboutHero.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", hero);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated About Hero';
    
    const existing = await AboutHero.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('about-hero', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await AboutHero.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await AboutHero.create(payload);
    await saveVersion('about-hero', null, created.toJSON(), userId, 'Created About Hero');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const hero = await AboutHero.findOne({ where: { isDeleted: false } });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = hero.toJSON();
    await saveVersion('about-hero', null, oldData, userId, 'Soft deleted About Hero');
    
    hero.isDeleted = true;
    hero.deletedAt = new Date();
    await hero.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const hero = await AboutHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = false;
    hero.deletedAt = null;
    await hero.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('about-hero', null, hero.toJSON(), userId, 'Restored About Hero');
    
    return status.responseStatus(res, 200, "Restored", hero);
  }),
};

// Content Sections
exports.content = {
  list: asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === 'true';
    const where = includeDeleted ? {} : { isDeleted: false };
    const sections = await AboutContent.findAll({ where, order: [["sectionType", "ASC"]] });
    return status.responseStatus(res, 200, "OK", sections);
  }),
  getByType: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const section = await AboutContent.findOne({ where: { sectionType: type, isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const payload = { ...req.body, sectionType: type };
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || `Updated About Content: ${type}`;
    
    const existing = await AboutContent.findOne({ where: { sectionType: type, isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('about-content', existing.id, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await AboutContent.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await AboutContent.create(payload);
    await saveVersion('about-content', created.id, created.toJSON(), userId, `Created About Content: ${type}`);
    return status.responseStatus(res, 201, "Created", created);
  }),
  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const section = await AboutContent.findByPk(id);
    if (!section || section.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('about-content', section.id, oldData, userId, 'Soft deleted About Content');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const section = await AboutContent.findByPk(id);
    if (!section || !section.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('about-content', section.id, section.toJSON(), userId, 'Restored About Content');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

// Redefining Healthcare Section
exports.redefiningHealthcare = {
  get: asyncHandler(async (req, res) => {
    const section = await AboutRedefiningHealthcare.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Redefining Healthcare Section';
    
    const existing = await AboutRedefiningHealthcare.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('about-redefining-healthcare', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await AboutRedefiningHealthcare.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await AboutRedefiningHealthcare.create(payload);
    await saveVersion('about-redefining-healthcare', null, created.toJSON(), userId, 'Created Redefining Healthcare Section');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const section = await AboutRedefiningHealthcare.findOne({ where: { isDeleted: false } });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('about-redefining-healthcare', null, oldData, userId, 'Soft deleted Redefining Healthcare Section');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const section = await AboutRedefiningHealthcare.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('about-redefining-healthcare', null, section.toJSON(), userId, 'Restored Redefining Healthcare Section');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

// Explore Refex Group Section
exports.refexGroup = {
  get: asyncHandler(async (req, res) => {
    const section = await AboutRefexGroup.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Explore Refex Group Section';
    
    const existing = await AboutRefexGroup.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('about-refex-group', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await AboutRefexGroup.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await AboutRefexGroup.create(payload);
    await saveVersion('about-refex-group', null, created.toJSON(), userId, 'Created Explore Refex Group Section');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const section = await AboutRefexGroup.findOne({ where: { isDeleted: false } });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('about-refex-group', null, oldData, userId, 'Soft deleted Explore Refex Group Section');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const section = await AboutRefexGroup.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('about-refex-group', null, section.toJSON(), userId, 'Restored Explore Refex Group Section');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

