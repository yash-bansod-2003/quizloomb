import { ZodError } from "zod";
import { ErrorResponse } from "@/middlewares/error-handler.js";

const zodErrorAdapter = (error: ZodError): ErrorResponse => {
  return {
    name: "Validation Error",
    code: 400,
    success: false,
    errors: error.issues.map((err) => ({
      message: err.message,
      path: err.path.join(","),
    })),
  };
};

export default zodErrorAdapter;
