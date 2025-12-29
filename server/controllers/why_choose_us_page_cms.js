const { WhyChooseUsHero, WhyChooseUsOfferings, WhyChooseUsAdvantages } = require("../models");
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
    const hero = await WhyChooseUsHero.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", hero);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Why Choose Us Hero';
    
    const existing = await WhyChooseUsHero.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('why-choose-us-hero', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await WhyChooseUsHero.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await WhyChooseUsHero.create(payload);
    await saveVersion('why-choose-us-hero', null, created.toJSON(), userId, 'Created Why Choose Us Hero');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const hero = await WhyChooseUsHero.findOne({ where: { isDeleted: false } });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = hero.toJSON();
    await saveVersion('why-choose-us-hero', null, oldData, userId, 'Soft deleted Why Choose Us Hero');
    
    hero.isDeleted = true;
    hero.deletedAt = new Date();
    await hero.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const hero = await WhyChooseUsHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = false;
    hero.deletedAt = null;
    await hero.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('why-choose-us-hero', null, hero.toJSON(), userId, 'Restored Why Choose Us Hero');
    
    return status.responseStatus(res, 200, "Restored", hero);
  }),
};

// Offerings Section
exports.offerings = {
  get: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsOfferings.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Why Choose Us Offerings';
    
    const existing = await WhyChooseUsOfferings.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('why-choose-us-offerings', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await WhyChooseUsOfferings.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await WhyChooseUsOfferings.create(payload);
    await saveVersion('why-choose-us-offerings', null, created.toJSON(), userId, 'Created Why Choose Us Offerings');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsOfferings.findOne({ where: { isDeleted: false } });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('why-choose-us-offerings', null, oldData, userId, 'Soft deleted Why Choose Us Offerings');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsOfferings.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('why-choose-us-offerings', null, section.toJSON(), userId, 'Restored Why Choose Us Offerings');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

// Advantages Section
exports.advantages = {
  get: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsAdvantages.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", section);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Why Choose Us Advantages';
    
    const existing = await WhyChooseUsAdvantages.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('why-choose-us-advantages', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await WhyChooseUsAdvantages.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await WhyChooseUsAdvantages.create(payload);
    await saveVersion('why-choose-us-advantages', null, created.toJSON(), userId, 'Created Why Choose Us Advantages');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsAdvantages.findOne({ where: { isDeleted: false } });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = section.toJSON();
    await saveVersion('why-choose-us-advantages', null, oldData, userId, 'Soft deleted Why Choose Us Advantages');
    
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const section = await WhyChooseUsAdvantages.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!section) return status.responseStatus(res, 404, "Not found");
    
    section.isDeleted = false;
    section.deletedAt = null;
    await section.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('why-choose-us-advantages', null, section.toJSON(), userId, 'Restored Why Choose Us Advantages');
    
    return status.responseStatus(res, 200, "Restored", section);
  }),
};

// Get all sections
exports.getAll = asyncHandler(async (req, res) => {
  const [hero, offerings, advantages] = await Promise.all([
    WhyChooseUsHero.findOne({ where: { isDeleted: false } }),
    WhyChooseUsOfferings.findOne({ where: { isDeleted: false } }),
    WhyChooseUsAdvantages.findOne({ where: { isDeleted: false } })
  ]);
  
  return status.responseStatus(res, 200, "OK", {
    hero,
    offerings,
    advantages
  });
});

