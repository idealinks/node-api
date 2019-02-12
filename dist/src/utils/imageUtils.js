"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicMediaUrl = (imageUrl, cropValue) => {
    try {
        const fileNameStart = imageUrl.lastIndexOf('/') + 1;
        const fileNameEncoded = encodeURI(imageUrl.substring(fileNameStart));
        const urlPath = imageUrl.substring(0, fileNameStart);
        const urlEncoded = `${urlPath}${fileNameEncoded}`;
        const relativeUrl = urlEncoded.replace(process.env.MEDIA_ZUZA_DOMAIN, '');
        return `${process.env.DYNAMIC_MEDIA_DOMAIN}/zz/m/${cropValue}${relativeUrl}`;
    }
    catch (err) {
        return undefined;
    }
};
//# sourceMappingURL=imageUtils.js.map