import express from "express";
import passport from "passport";
import path from "path";
import { routes } from "../src/routes/index.js";
import { errorHandler } from "../src/middlewares/error-handler.js";
import { configurePassport } from "../src/middlewares/passport.config.js";
import { env } from "./env.js";
import helmet from "helmet";
import cors from "cors";
import { APIError } from "../src/utils/app-error.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configurePassport();
app.use(passport.initialize());

const allowedOrigins = ["https://yourdomain.com"];

if (env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    // Minimal request logger for local dev.
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// CORS Configuration
const corsOptions = {
  origin: env.NODE_ENV === "production" ? allowedOrigins : true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: { policy: "credentialless" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    xContentTypeOptions: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${(res as any).locals.cspNonce}'`],
        styleSrc: ["'self'"],
        objectSrc: ["'none'"],
        imgSrc: ["'self'", "data:"],
        scriptSrcAttr: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {},
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "same-origin" },
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
  }),
);

app.set("json spaces", 2);
app.set("case sensitive routing", false);
app.set("strict routing", true);
app.set("x-powered-by", false);

app.use("/public", express.static(path.resolve("public")));

app.use("/api", routes);

// 404 handler
app.use((req, res, next) => {
  next(new APIError("API not found", 404));
});

app.use(errorHandler);

export default app;
