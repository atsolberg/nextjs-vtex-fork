import { Partytown } from "@builder.io/partytown/react";
import { useEffect, useState } from "react";

import storeConfig from "../../../store.config";
import GoogleTagManager from "./GoogleTagManager";
import VTEX from "./vtex";

const isString = (obj: unknown): obj is string => typeof obj === "string";

const gtmContainerId = storeConfig.analytics?.gtmContainerId;

const includeGTM = typeof gtmContainerId === "string";
const includeVTEX = storeConfig.platform === "vtex";

if (process.env.NODE_ENV === "development" && !includeGTM) {
  console.warn(
    "No GTM container id found. Check the analytics section on your store.config.js file for enhanced observability of your store."
  );
}

function ThirdPartyScripts() {
  const [scripts3p, setScripts3p] = useState(false);

  useEffect(() => {
    const include3pScripts = window === window.top;

    if (include3pScripts) {
      setScripts3p(true);
    }
  }, []);

  if (scripts3p === false) {
    return null;
  }

  return (
    <>
      {includeGTM && <GoogleTagManager containerId={gtmContainerId} />}
      {includeVTEX && <VTEX />}
      <Partytown
        key="partytown"
        // Variables to forward to from main to worker
        forward={[
          includeGTM && "dataLayer.push",
          includeVTEX && "sendrc"
        ].filter(isString)}
      />
    </>
  );
}

export default ThirdPartyScripts;
