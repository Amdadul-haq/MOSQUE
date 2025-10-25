import { useState } from "react";
import * as Clipboard from "expo-clipboard";

/**
 * Custom hook for copy functionality with visual feedback
 * Similar to DeepSeek AI's copy experience
 */
export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const copyText = async (text: string, label: string = "") => {
    try {
      // ✅ ACTUAL EXPO CLIPBOARD IMPLEMENTATION
      await Clipboard.setStringAsync(text);

      // Show visual feedback
      setIsCopied(true);
      setCopiedText(label || text);

      // Auto hide after 1.5 seconds
      setTimeout(() => {
        setIsCopied(false);
        setCopiedText("");
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return {
    copyText,
    isCopied,
    copiedText,
  };
};

/**
 * Simple copy function for one-time use
 */
export const copyWithFeedback = async (text: string, label: string = "") => {
  try {
    // ✅ ACTUAL EXPO CLIPBOARD IMPLEMENTATION
    await Clipboard.setStringAsync(text);

    // Return success state for component to handle
    return {
      success: true,
      text: label || text,
    };
  } catch (error) {
    console.error("Copy failed:", error);
    return {
      success: false,
      error: "Copy failed",
    };
  }
};
