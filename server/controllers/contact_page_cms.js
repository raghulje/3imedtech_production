const { ContactHero, ContactInfoCard, ContactMap, ContactForm } = require("../models");
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
    const hero = await ContactHero.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", hero);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Contact Hero';
    
    const existing = await ContactHero.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('contact-hero', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await ContactHero.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await ContactHero.create(payload);
    await saveVersion('contact-hero', null, created.toJSON(), userId, 'Created Contact Hero');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const hero = await ContactHero.findOne({ where: { isDeleted: false } });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = hero.toJSON();
    await saveVersion('contact-hero', null, oldData, userId, 'Soft deleted Contact Hero');
    
    hero.isDeleted = true;
    hero.deletedAt = new Date();
    await hero.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const hero = await ContactHero.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!hero) return status.responseStatus(res, 404, "Not found");
    
    hero.isDeleted = false;
    hero.deletedAt = null;
    await hero.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('contact-hero', null, hero.toJSON(), userId, 'Restored Contact Hero');
    
    return status.responseStatus(res, 200, "Restored", hero);
  }),
};

// Info Cards
exports.infoCards = {
  list: asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === 'true';
    const where = includeDeleted ? {} : { isDeleted: false };
    const cards = await ContactInfoCard.findAll({ where, order: [["order", "ASC"]] });
    return status.responseStatus(res, 200, "OK", cards);
  }),
  get: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await ContactInfoCard.findByPk(id);
    if (!card || card.isDeleted) return status.responseStatus(res, 404, "Not found");
    return status.responseStatus(res, 200, "OK", card);
  }),
  create: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    
    const created = await ContactInfoCard.create(payload);
    await saveVersion('contact-info-card', created.id, created.toJSON(), userId, 'Created Contact Info Card');
    return status.responseStatus(res, 201, "Created", created);
  }),
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await ContactInfoCard.findByPk(id);
    if (!card || card.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = card.toJSON();
    const changeDescription = req.body.changeDescription || 'Updated Contact Info Card';
    await saveVersion('contact-info-card', card.id, oldData, userId, changeDescription);
    
    await card.update(req.body);
    return status.responseStatus(res, 200, "Updated", card);
  }),
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await ContactInfoCard.findByPk(id);
    if (!card || card.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = card.toJSON();
    await saveVersion('contact-info-card', card.id, oldData, userId, 'Soft deleted Contact Info Card');
    
    card.isDeleted = true;
    card.deletedAt = new Date();
    await card.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await ContactInfoCard.findByPk(id);
    if (!card || !card.isDeleted) return status.responseStatus(res, 404, "Not found");
    
    card.isDeleted = false;
    card.deletedAt = null;
    await card.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('contact-info-card', card.id, card.toJSON(), userId, 'Restored Contact Info Card');
    
    return status.responseStatus(res, 200, "Restored", card);
  }),
};

// Map Section
exports.map = {
  get: asyncHandler(async (req, res) => {
    const map = await ContactMap.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", map);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Contact Map';
    
    const existing = await ContactMap.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('contact-map', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await ContactMap.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await ContactMap.create(payload);
    await saveVersion('contact-map', null, created.toJSON(), userId, 'Created Contact Map');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const map = await ContactMap.findOne({ where: { isDeleted: false } });
    if (!map) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = map.toJSON();
    await saveVersion('contact-map', null, oldData, userId, 'Soft deleted Contact Map');
    
    map.isDeleted = true;
    map.deletedAt = new Date();
    await map.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const map = await ContactMap.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!map) return status.responseStatus(res, 404, "Not found");
    
    map.isDeleted = false;
    map.deletedAt = null;
    await map.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('contact-map', null, map.toJSON(), userId, 'Restored Contact Map');
    
    return status.responseStatus(res, 200, "Restored", map);
  }),
};

// Form Section
exports.form = {
  get: asyncHandler(async (req, res) => {
    const form = await ContactForm.findOne({ where: { isDeleted: false } });
    return status.responseStatus(res, 200, "OK", form);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || 'Updated Contact Form';
    
    const existing = await ContactForm.findOne({ where: { isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion('contact-form', null, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await ContactForm.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await ContactForm.create(payload);
    await saveVersion('contact-form', null, created.toJSON(), userId, 'Created Contact Form');
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const form = await ContactForm.findOne({ where: { isDeleted: false } });
    if (!form) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = form.toJSON();
    await saveVersion('contact-form', null, oldData, userId, 'Soft deleted Contact Form');
    
    form.isDeleted = true;
    form.deletedAt = new Date();
    await form.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const form = await ContactForm.findOne({ where: { isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!form) return status.responseStatus(res, 404, "Not found");
    
    form.isDeleted = false;
    form.deletedAt = null;
    await form.save();
    
    const userId = req.userData?.id || null;
    await saveVersion('contact-form', null, form.toJSON(), userId, 'Restored Contact Form');
    
    return status.responseStatus(res, 200, "Restored", form);
  }),
};

