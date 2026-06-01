"use client";

import type { FriendlyCaptchaSDK } from "@friendlycaptcha/sdk";
import type { FriendlyCaptchaRegion } from "./friendly-captcha";

let sdk: FriendlyCaptchaSDK | null = null;
let sdkRegion: FriendlyCaptchaRegion | null = null;

/** Eine SDK-Instanz pro Tab — laut Friendly Captcha empfohlen. */
export function getFriendlyCaptchaSdkClient(
  region: FriendlyCaptchaRegion
): FriendlyCaptchaSDK {
  if (sdk && sdkRegion === region) return sdk;

  const { FriendlyCaptchaSDK } =
    require("@friendlycaptcha/sdk") as typeof import("@friendlycaptcha/sdk");

  sdk = new FriendlyCaptchaSDK({
    apiEndpoint: region === "global" ? "global" : "eu",
    disableEvalPatching: process.env.NODE_ENV === "development",
  });
  sdkRegion = region;
  return sdk;
}
