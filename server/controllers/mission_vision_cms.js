const { MissionVisionHero, MissionVisionContent } = require("../models");
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
    const hero = await MissionVisionHero.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", hero);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Mission & Vision Hero';
    
    const existing = await MissionVisionHero.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('mission-vision-hero', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await MissionVisionHero.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await MissionVisionHero.create(payload);
    await saveVersion('mission-vision-hero', null, created.toJSON(), userId, 'Created Mission & Vision Hero');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const hero = await MissionVisionHero.findOne({ where: { isDeleted: false } });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = hero.toJSON();
    await saveVersion('mission-vision-hero', null, oldData, userId, 'Soft deleted Mission & Vision Hero');
    
    hero.isDeleted = true;
    hero.deletedAt = new Date();
    await hero.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const hero = await MissionVisionHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = false;
    hero.deletedAt = null;
    await hero.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('mission-vision-hero', null, hero.toJSON(), userId, 'Restored Mission & Vision Hero');
    
    return status.responseStatus(res, 200, "Restored", hero);
  }),
};

// Content Sections (Mission/Vision)
exports.content = {
  list: asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === 'true';
    const where = includeDeleted ? {} : { isDeleted: false };
    const sections = await MissionVisionContent.findAll({ where, order: [["sectionType", "ASC"]] });
    return status.responseStatus(res, 200, "OK", sections);
  }),
  getByType: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const section = await MissionVisionContent.findOne({ where: { sectionType: type, isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const payload = { ...req.body, sectionType: type };
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || `Updated Mission & Vision Content: ${type}`;
    
    const existing = await MissionVisionContent.findOne({ where: { sectionType: type, isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('mission-vision-content', existing.id, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await MissionVisionContent.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await MissionVisionContent.create(payload);
    await saveVersion('mission-vision-content', created.id, created.toJSON(), userId, `Created Mission & Vision Content: ${type}`);
    return status.responseStatus(res, 201, "Created", created);
  }),
  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const section = await MissionVisionContent.findByPk(id);
    if (!section || section.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('mission-vision-content', section.id, oldData, userId, 'Soft deleted Mission & Vision Content');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const section = await MissionVisionContent.findByPk(id);
    if (!section || !section.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('mission-vision-content', section.id, section.toJSON(), userId, 'Restored Mission & Vision Content');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};
