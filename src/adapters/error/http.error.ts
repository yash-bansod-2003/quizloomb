import { HttpError } from "http-errors";
import { ErrorResponse } from "@/middlewares/error-handler.js";

const httpErrorAdapter = (error: HttpError): ErrorResponse => {
  return {
    name: error.name,
    code: error.statusCode,
    success: false,
    errors: [
      {
        message: error.message,
        path: "",
      },
    ],
  };
};

export default httpErrorAdapter;
