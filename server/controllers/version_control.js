const { VersionControl } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

// Get versions for a section
exports.getVersions = asyncHandler(async (req, res) => {
  const { sectionType, sectionId } = req.query;
  const where = { isActive: true };
  if (sectionType) where.sectionType = sectionType;
  if (sectionId) where.sectionId = sectionId;

  const versions = await VersionControl.findAll({
    where,
    order: [['versionNumber', 'DESC']],
    limit: 50
  });

  return status.responseStatus(res, 200, "OK", versions);
});

// Create new version (called internally by other controllers)
// Note: This is NOT a route handler, so it doesn't use asyncHandler
exports.createVersion = async (sectionType, sectionId, data, userId, changeDescription) => {
  // Get latest version number
  const latest = await VersionControl.findOne({
    where: { sectionType, sectionId: sectionId || null, isActive: true },
    order: [['versionNumber', 'DESC']]
  });

  const versionNumber = latest ? latest.versionNumber + 1 : 1;

  const version = await VersionControl.create({
    sectionType,
    sectionId: sectionId || null,
    versionNumber,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    userId: userId || null,
    changeDescription: changeDescription || 'Updated'
  });

  return version;
};

// Get version data (for preview/restore)
exports.getVersion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const version = await VersionControl.findByPk(id);
  if (!version || !version.isActive) return status.responseStatus(res, 404, "Version not found");

  // Parse the version data
  const data = typeof version.data === 'string' ? JSON.parse(version.data) : version.data;

  return status.responseStatus(res, 200, "OK", { data, version: version.toJSON() });
});

// Delete a version (soft delete)
exports.deleteVersion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const version = await VersionControl.findByPk(id);
  if (!version) return status.responseStatus(res, 404, "Not found");

  version.isActive = false;
  await version.save();

  return status.responseStatus(res, 200, "Deleted");
});

