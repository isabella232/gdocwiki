import type { Message } from "./types";
import { storeTokenFromOAuthRedirection } from "../utils/oauth";
import { log } from "../utils/log";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("options.html"),
    });
  }
});

chrome.runtime.onMessage.addListener(async (message: Message, sender) => {
  switch (message.event) {
    case "oauth2Finish":
      try {
        await storeTokenFromOAuthRedirection(message.url);
      } catch (e) {
        log.error("OAuth failed", e);
      }
      // Even if there are errors during exchanging the auth token, just close the auth window, since we can detect auth failures later.
      chrome.tabs.remove(sender.tab!.id!);
      break;
  }
});
