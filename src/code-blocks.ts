const boundRoots = new WeakSet<EventTarget>();
const resetTimers = new WeakMap<HTMLButtonElement, number>();

const readCodeText = (button: HTMLButtonElement): string => {
  const container = button.closest(".koppa-code-block");
  const code = container?.querySelector("code");

  return code?.textContent ?? "";
};

const setButtonState = (
  button: HTMLButtonElement,
  label: string,
  state: string,
): void => {
  button.textContent = label;
  button.dataset.copyState = state;
};

const resetButtonStateLater = (button: HTMLButtonElement): void => {
  const existingTimer = resetTimers.get(button);

  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  const timer = window.setTimeout(() => {
    setButtonState(button, "Copy", "idle");
    resetTimers.delete(button);
  }, 1_800);

  resetTimers.set(button, timer);
};

const fallbackCopyText = (text: string): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
};

const copyText = async (text: string): Promise<boolean> => {
  if (!text) {
    return false;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopyText(text);
    }
  }

  return fallbackCopyText(text);
};

const handleCodeBlockClick = async (event: Event): Promise<void> => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>(".koppa-copy-button");

  if (!button) {
    return;
  }

  const text = readCodeText(button);
  const copied = await copyText(text);

  setButtonState(
    button,
    copied ? "Copied" : "Unavailable",
    copied ? "done" : "error",
  );
  resetButtonStateLater(button);
};

export const installCodeBlockCopyButtons = (
  root: HTMLElement | Document = document,
): void => {
  if (boundRoots.has(root)) {
    return;
  }

  root.addEventListener("click", (event) => {
    void handleCodeBlockClick(event);
  });
  boundRoots.add(root);
};
