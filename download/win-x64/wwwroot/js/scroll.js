let _lastScrollTime = 0;
const SCROLL_THROTTLE_MS = 300;
const NEAR_BOTTOM_THRESHOLD = 150;

export function scrollToBottom(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Only scroll if user is near the bottom (not scrolled up to read)
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom > NEAR_BOTTOM_THRESHOLD) return;

    // Throttle scroll calls to avoid layout thrashing
    const now = Date.now();
    if (now - _lastScrollTime < SCROLL_THROTTLE_MS) return;
    _lastScrollTime = now;

    el.scrollTop = el.scrollHeight;
}

export function scrollToBottomForce(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.scrollTop = el.scrollHeight;
    }
}

export function scrollToElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export function isNearBottom(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= NEAR_BOTTOM_THRESHOLD;
}
