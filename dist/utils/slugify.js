"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(text) {
    if (!text || typeof text !== "string") {
        return "";
    }
    return text
        .toString()
        .normalize("NFD") // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+|-+$/g, ""); // Trim - from start & end
}
//# sourceMappingURL=slugify.js.map