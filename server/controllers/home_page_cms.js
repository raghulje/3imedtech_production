const { HomeHero, HomeAboutSection, HomeImageBox, HomeCommitment } = require("../models");
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
    // Don't fail the request if versioning fails
  }
}

// Hero Section
exports.hero = {
  get: asyncHandler(async (req, res) => {
    const hero = await HomeHero.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", hero);
  }),
  upsert: asyncHandler(async (req, res) => {
    console.log('📝 Hero upsert called:', { method: req.method, body: req.body, user: req.userData });
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Home Hero';
    
    console.log('📝 Processing hero update:', { payload, userId, hasUser: !!req.user, hasUserData: !!req.userData });
    
    const existing = await HomeHero.findOne({ where: { isDeleted: false } });
    if (existing) {
      // Save version before update
      const oldData = existing.toJSON();
      await saveVersion('home-hero', null, oldData, userId, changeDescription);
      
      await existing.update(payload);
      const updated = await HomeHero.findByPk(existing.id);
      console.log('✅ Hero updated successfully:', updated.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await HomeHero.create(payload);
    await saveVersion('home-hero', null, created.toJSON(), userId, 'Created Home Hero');
    console.log('✅ Hero created successfully:', created.id);
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const hero = await HomeHero.findOne({ where: { isDeleted: false } });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = true;
    hero.deletedAt = new Date();
    await hero.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const hero = await HomeHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = false;
    hero.deletedAt = null;
    await hero.save();
    
    return status.responseStatus(res, 200, "Restored", hero);
  }),
};

// About Section
exports.aboutSection = {
  get: asyncHandler(async (req, res) => {
    const section = await HomeAboutSection.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.user?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Home About Section';
    
    const existing = await HomeAboutSection.findOne({ where: { isDeleted: false } });
    if (existing) {
      // Save version before update
      const oldData = existing.toJSON();
      await saveVersion('home-about-section', null, oldData, userId, changeDescription);
      
      await existing.update(payload);
      const updated = await HomeAboutSection.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await HomeAboutSection.create(payload);
    await saveVersion('home-about-section', null, created.toJSON(), userId, 'Created Home About Section');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const section = await HomeAboutSection.findOne({ where: { isDeleted: false } });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const section = await HomeAboutSection.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

// Image Boxes
exports.imageBoxes = {
  list: asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === 'true';
    const where = includeDeleted ? {} : { isDeleted: false };
    const boxes = await HomeImageBox.findAll({ where, order: [["order", "ASC"]] });
    return status.responseStatus(res, 200, "OK", boxes);
  }),
  create: asyncHandler(async (req, res) => {
    const userId = req.user?.id || null;
    const box = await HomeImageBox.create(req.body);
    await saveVersion('home-image-box', box.id, box.toJSON(), userId, 'Created Home Image Box');
    return status.responseStatus(res, 201, "Created", box);
  }),
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const changeDescription = req.body.changeDescription || `Updated Home Image Box #${id}`;
    
    const box = await HomeImageBox.findByPk(id);
    if (!box || box.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    // Save version before update
    const oldData = box.toJSON();
    await saveVersion('home-image-box', parseInt(id), oldData, userId, changeDescription);
    
    await box.update(req.body);
    const updated = await HomeImageBox.findByPk(id);
    return status.responseStatus(res, 200, "Updated", updated);
  }),
  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const box = await HomeImageBox.findByPk(id);
    if (!box || box.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    // Soft delete
    box.isDeleted = true;
    box.deletedAt = new Date();
    await box.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const box = await HomeImageBox.findByPk(id);
    if (!box || !box.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    box.isDeleted = false;
    box.deletedAt = null;
    await box.save();
    
    const userId = req.user?.id || null;
    await saveVersion('home-image-box', parseInt(id), box.toJSON(), userId, 'Restored Home Image Box');
    
    return status.responseStatus(res, 200, "Restored", box);
  }),
  permanentDelete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const box = await HomeImageBox.findByPk(id);
    if (!box) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.user?.id || null;
    await saveVersion('home-image-box', parseInt(id), box.toJSON(), userId, 'Permanently deleted Home Image Box');
    
    await box.destroy();
    
    return status.responseStatus(res, 200, "Permanently deleted");
  }),
};

// Commitment Section
exports.commitment = {
  get: asyncHandler(async (req, res) => {
    const commitment = await HomeCommitment.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", commitment);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.user?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Home Commitment';
    
    const existing = await HomeCommitment.findOne({ where: { isDeleted: false } });
    if (existing) {
      // Save version before update
      const oldData = existing.toJSON();
      await saveVersion('home-commitment', null, oldData, userId, changeDescription);
      
      await existing.update(payload);
      const updated = await HomeCommitment.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await HomeCommitment.create(payload);
    await saveVersion('home-commitment', null, created.toJSON(), userId, 'Created Home Commitment');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const commitment = await HomeCommitment.findOne({ where: { isDeleted: false } });
    if (!commitment) return status.responseStatus(res, 404, "Not found");
    
    commitment.isDeleted = true;
    commitment.deletedAt = new Date();
    await commitment.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const commitment = await HomeCommitment.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!commitment) return status.responseStatus(res, 404, "Not found");
    
    commitment.isDeleted = false;
    commitment.deletedAt = null;
    await commitment.save();
    
    return status.responseStatus(res, 200, "Restored", commitment);
  }),
};

