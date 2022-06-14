export const PROMPT_ORDER_APPNAME = 0;
export const PROMPT_ORDER_REACTFRAMEWORKS = 10;
export const PROMPT_ORDER_REACTFRAMEWORK = 15;
export const PROMPT_ORDER_FEATURES = 20;

export const FEATURE_HIDDEN_DISABLED = [false, false, true] as const;
export const FEATURE_HIDDEN_ENABLED = [true, true, true] as const;
export const FEATURE_DISABLED = [false, true, false] as const;
export const FEATURE_ENABLED = [true, true, false] as const;
