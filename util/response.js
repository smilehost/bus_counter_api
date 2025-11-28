export default class ResponseFormatter {
  static success(data, status = true) {
    return {
      success: status,
      data,
    };
  }
  static pagination(data, total, limit, page, status = true) {
    return {
      success: status,
      data,
      meta: {
        total,
        limit,
        page,
        totalpages: Math.ceil(total / limit),
      },
    };
  }
}
