import path from "path";
import {
  VendureConfig,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  dummyPaymentHandler,
} from "@vendure/core";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { EmailPlugin, defaultEmailHandlers } from "@vendure/email-plugin";
import "dotenv/config";

const IS_DEV = process.env.APP_ENV === "dev";

export const config: VendureConfig = {
  apiOptions: {
    port: Number(process.env.PORT ?? 3002),
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    ...(IS_DEV
      ? {
          adminApiPlayground: { settings: { "request.credentials": "include" } },
          adminApiDebug: true,
          shopApiPlayground: { settings: { "request.credentials": "include" } },
          shopApiDebug: true,
        }
      : {}),
    cors: {
      origin: [
        process.env.SHOP_ORIGIN ?? "http://localhost:3000",
        process.env.ADMIN_ORIGIN ?? "http://localhost:3002",
      ],
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME ?? "superadmin",
      password: process.env.SUPERADMIN_PASSWORD ?? "superadmin",
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET ?? "lingyun-cookie-secret",
    },
  },
  dbConnectionOptions: {
    type: "postgres",
    synchronize: false,
    migrations: [path.join(__dirname, "../migrations/*.+(js|ts)")],
    logging: false,
    database: process.env.DB_NAME ?? "lingyun_vendure",
    schema: process.env.DB_SCHEMA ?? "public",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      assetUrlPrefix: IS_DEV ? undefined : "/assets/",
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        fromAddress: '"LingYun" <noreply@lingyun.local>',
        verifyEmailAddressUrl: "http://localhost:3000/verify",
        passwordResetUrl: "http://localhost:3000/password-reset",
        changeEmailAddressUrl: "http://localhost:3000/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3003,
      adminUiConfig: {
        brand: "LingYun FengShui",
        hideVendureBranding: false,
        hideVersion: false,
      },
    }),
  ],
};
