import { RequestHandler } from "express";

const notFound: RequestHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Route Not Found",
      },
    ],
  });
};

export default notFound;
