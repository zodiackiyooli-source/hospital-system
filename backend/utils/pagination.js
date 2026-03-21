// Pagination utility for MongoDB queries
const getPaginationOptions = (req) => {
  const pageRaw = parseInt(req.query.page);
  const limitRaw = parseInt(req.query.limit);

  const page = isNaN(pageRaw) ? 1 : Math.max(1, pageRaw);
  const limit = isNaN(limitRaw) ? 10 : Math.max(1, limitRaw);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};


// Build paginated query
const paginateQuery = (model) => async (filter = {}, options = null) => {
  // Hubi haddii options la soo gudbiyey, haddii kale defaut-ka isticmaal
  const ops = options || { page: 1, limit: 10, skip: 0 };
  
  const [data, total] = await Promise.all([
    model.find(filter).sort({ createdAt: -1 }).skip(ops.skip).limit(ops.limit),
    model.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / ops.limit);

  return {
    data,
    pagination: {
      current: ops.page,
      pages: totalPages,
      total,
      hasNext: ops.page < totalPages,
      hasPrev: ops.page > 1
    }
  };
};


module.exports = { getPaginationOptions, paginateQuery };

