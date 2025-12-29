const status = require("../helpers/response");
const { SearchResult } = require("../models");
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

// Get all search results
exports.getAll = asyncHandler(async (req, res) => {
  const results = await SearchResult.findAll({
    where: { isDeleted: false },
    order: [['pageNumber', 'ASC'], ['displayOrder', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", results);
});

// Get search results by page number
exports.getByPage = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const pageNumber = parseInt(page) || 1;
  
  const results = await SearchResult.findAll({
    where: { 
      isDeleted: false,
      isActive: true,
      pageNumber: pageNumber
    },
    order: [['displayOrder', 'ASC']],
    limit: 10
  });
  
  return status.responseStatus(res, 200, "OK", results);
});

// Create search result
exports.create = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Created Search Result';
  
  const created = await SearchResult.create(payload);
  await saveVersion('search-result', created.id, created.toJSON(), userId, changeDescription);
  
  return status.responseStatus(res, 201, "Created", created);
});

// Update search result
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  const userId = req.userData?.id || null;
  const changeDescription = req.body.changeDescription || 'Updated Search Result';
  
  const existing = await SearchResult.findByPk(id);
  if (!existing) {
    return status.responseStatus(res, 404, "Not found");
  }
  
  const oldData = existing.toJSON();
  await saveVersion('search-result', id, oldData, userId, changeDescription);
  
  await existing.update(payload);
  const updated = await SearchResult.findByPk(id);
  
  return status.responseStatus(res, 200, "Updated", updated);
});

// Delete search result (soft delete)
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userData?.id || null;
  
  const existing = await SearchResult.findByPk(id);
  if (!existing) {
    return status.responseStatus(res, 404, "Not found");
  }
  
  const oldData = existing.toJSON();
  await saveVersion('search-result', id, oldData, userId, 'Deleted Search Result');
  
  await existing.update({ isDeleted: true, deletedAt: new Date() });
  
  return status.responseStatus(res, 200, "Deleted");
});

