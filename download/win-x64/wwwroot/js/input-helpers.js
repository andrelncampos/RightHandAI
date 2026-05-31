export function getCursorLineInfo(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return { isFirstLine: true, isLastLine: true };

    // Find the actual textarea inside the MudTextField wrapper
    const textarea = el.querySelector('textarea') || el;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return { isFirstLine: true, isLastLine: true };

    const value = textarea.value || '';
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // If there's a selection range, don't navigate history
    if (selectionStart !== selectionEnd) return { isFirstLine: false, isLastLine: false };

    const textBeforeCursor = value.substring(0, selectionStart);
    const textAfterCursor = value.substring(selectionStart);

    const isFirstLine = !textBeforeCursor.includes('\n');
    const isLastLine = !textAfterCursor.includes('\n');

    return { isFirstLine, isLastLine };
}

export function resetTextareaHeight(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const textarea = el.querySelector('textarea') || el;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;

    textarea.style.height = 'auto';
    textarea.style.height = '';
}
