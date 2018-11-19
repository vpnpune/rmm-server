export const
    SOFT_DELETE_FIND_QUERY = { $or: [{ "deleted": { $exists: true, $eq: false } }, { "deleted": { $exists: false } }] };


