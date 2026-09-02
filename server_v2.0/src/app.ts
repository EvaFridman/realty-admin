import express from "express";
import usersRouter from "./routes/usersRouter";
import userAvatarRouter from "./routes/userAvatarRouter";
import districtsRouter from "./routes/districtsRouter";
import listingsRouter from "./routes/listingsRouter";
import favoritesRouter from "./routes/favoritesRouter";
import viewingsRouter from "./routes/viewingsRouter";
import logsRouter from "./routes/logsRouter";
import listingPhotosRouter from "./routes/listingPhotosRouter";
import viewingsStatusRouter from "./routes/viewingsStatusRouter";
import pdfRouter from "./routes/pdfRouter";
import authRouter from "./routes/authRouter";
import cspReportRouter from "./routes/cspReportRouter";
import filesRouter from "./routes/filesRouter";
import { setupMiddleware } from "./bootstrap/middleware";
import { errorHandler } from "./middleware/errorHandler";
import { loggerMiddleware } from "./middleware/loggerMiddleware";

const app = express();

app.use(loggerMiddleware);

app.use(cspReportRouter);

setupMiddleware(app);

app.use("/uploads", filesRouter);

app.use("/auth", authRouter);
app.use("/logs", logsRouter);
app.use("/users", usersRouter);
app.use("/users", userAvatarRouter);
app.use("/districts", districtsRouter);
app.use("/listings/:id/viewings", viewingsRouter);
app.use("/listings/:id/photos", listingPhotosRouter);
app.use("/listings", listingsRouter);
app.use("/users/:id/favorites", favoritesRouter);
app.use("/viewings", viewingsStatusRouter);
app.use(pdfRouter);

app.use(errorHandler);

export default app;