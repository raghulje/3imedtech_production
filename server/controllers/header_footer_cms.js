const { HeaderFooter } = require("../models");
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

exports.settings = {
  get: asyncHandler(async (req, res) => {
    const { type } = req.params; // 'header' or 'footer'
    const settings = await HeaderFooter.findOne({ where: { componentType: type, isDeleted: false } });
    return status.responseStatus(res, 200, "OK", settings);
  }),
  upsert: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const payload = { ...req.body, componentType: type };
    const userId = req.userData?.id || null;
    const changeDescription = req.body.changeDescription || `Updated ${type}`;
    
    const existing = await HeaderFooter.findOne({ where: { componentType: type, isDeleted: false } });
    if (existing) {
      const oldData = existing.toJSON();
      await saveVersion(`header-footer-${type}`, existing.id, oldData, userId, changeDescription);
      await existing.update(payload);
      const updated = await HeaderFooter.findByPk(existing.id);
      return status.responseStatus(res, 200, "Updated", updated);
    }
    const created = await HeaderFooter.create(payload);
    await saveVersion(`header-footer-${type}`, created.id, created.toJSON(), userId, `Created ${type}`);
    return status.responseStatus(res, 201, "Created", created);
  }),
  softDelete: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const settings = await HeaderFooter.findOne({ where: { componentType: type, isDeleted: false } });
    if (!settings) return status.responseStatus(res, 404, "Not found");
    
    const userId = req.userData?.id || null;
    const oldData = settings.toJSON();
    await saveVersion(`header-footer-${type}`, settings.id, oldData, userId, `Soft deleted ${type}`);
    
    settings.isDeleted = true;
    settings.deletedAt = new Date();
    await settings.save();
    
    return status.responseStatus(res, 200, "Deleted");
  }),
  restore: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const settings = await HeaderFooter.findOne({ where: { componentType: type, isDeleted: true }, order: [['deletedAt', 'DESC']] });
    if (!settings) return status.responseStatus(res, 404, "Not found");
    
    settings.isDeleted = false;
    settings.deletedAt = null;
    await settings.save();
    
    const userId = req.userData?.id || null;
    await saveVersion(`header-footer-${type}`, settings.id, settings.toJSON(), userId, `Restored ${type}`);
    
    return status.responseStatus(res, 200, "Restored", settings);
  }),
};
