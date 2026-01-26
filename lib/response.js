// Response Handler Utility
// Path: lib/response.js

export class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(error, statusCode = 500) {
    return {
      success: false,
      error: typeof error === 'string' ? error : error.message,
      statusCode,
    };
  }

  static paginated(data, total, page, limit) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export function sendResponse(res, statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
