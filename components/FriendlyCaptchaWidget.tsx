"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type {
  FRCWidgetCompleteEvent,
  FRCWidgetErrorEventData,
  WidgetErrorData,
  WidgetHandle,
} from "@friendlycaptcha/sdk";
import type { FriendlyCaptchaRegion } from "@/lib/friendly-captcha";
import { getFriendlyCaptchaSdkClient } from "@/lib/friendly-captcha-sdk-client";

export type FriendlyCaptchaWidgetRef = {
  reset: () => void;
};

type Props = {
  sitekey: string;
  region?: FriendlyCaptchaRegion;
  onComplete?: (response: string) => void;
  onError?: (error: WidgetErrorData) => void;
  onExpire?: () => void;
};

export const FriendlyCaptchaWidget = forwardRef<FriendlyCaptchaWidgetRef, Props>(
  function FriendlyCaptchaWidget(props, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<WidgetHandle | null>(null);
    const { onComplete, onError, onExpire, region = "eu", sitekey } = props;

    const onCompleteRef = useRef(onComplete);
    const onErrorRef = useRef(onError);
    const onExpireRef = useRef(onExpire);
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;

    useEffect(() => {
      const mount = mountRef.current;
      if (!mount || !sitekey) return;

      let alive = true;
      const sdk = getFriendlyCaptchaSdkClient(region);

      const widget = sdk.createWidget({
        element: mount,
        sitekey,
        apiEndpoint: region === "global" ? "global" : "eu",
        language: "de",
        theme: "dark",
        startMode: "none",
      });
      widgetRef.current = widget;

      const handleComplete = (e: Event) => {
        onCompleteRef.current?.((e as FRCWidgetCompleteEvent).detail.response);
      };
      const handleError = (e: Event) => {
        onErrorRef.current?.(
          (e as CustomEvent<FRCWidgetErrorEventData>).detail.error
        );
      };
      const handleExpire = () => onExpireRef.current?.();

      mount.addEventListener("frc:widget.complete", handleComplete);
      mount.addEventListener("frc:widget.error", handleError);
      mount.addEventListener("frc:widget.expire", handleExpire);

      const frame = requestAnimationFrame(() => {
        if (!alive || widget.isDestroyed) return;
        widget.start();
      });

      return () => {
        alive = false;
        cancelAnimationFrame(frame);
        mount.removeEventListener("frc:widget.complete", handleComplete);
        mount.removeEventListener("frc:widget.error", handleError);
        mount.removeEventListener("frc:widget.expire", handleExpire);
        if (!widget.isDestroyed) {
          widget.destroy();
        }
        widgetRef.current = null;
      };
    }, [sitekey, region]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        const widget = widgetRef.current;
        if (widget && !widget.isDestroyed) {
          widget.reset();
        }
      },
    }));

    return <div ref={mountRef} className="min-h-[72px]" />;
  }
);
