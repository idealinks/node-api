"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUtils_1 = require("../utils/imageUtils");
exports.transformNavigation = (results = {}) => {
    if (!Array.isArray(results.items)) {
        return [];
    }
    return results.items.map(item => {
        return {
            label: item.titleOverride,
            children: exports.transformSecondaryNavItems(item.navigationItems)
        };
    });
};
exports.transformSecondaryNavItems = (items = []) => {
    return items.map(item => {
        const { label, navigationUrl, enabled, openNewWindow, noFollow } = item;
        return {
            label,
            navigationUrl,
            enabled,
            openNewWindow,
            noFollow
        };
    });
};
exports.transformArticleItems = (items = []) => {
    try {
        return items.map(item => ({
            assetId: item.assetId,
            title: item.title,
            description: item.description,
            imageAlt: item.imageAlt,
            category: item.category,
            navigationUrl: item.detailUrl,
            displayPublishDate: item.displayPublishFromDate,
            openNewWindow: item.detailNewWindow,
            thumbnails: {
                small: imageUtils_1.getDynamicMediaUrl(item.imageUrl, 'cropped_90x90'),
                large: imageUtils_1.getDynamicMediaUrl(item.imageUrl, 'cropped_300x200')
            }
        }));
    }
    catch (err) {
        console.error('Error: transfroming articles', err);
        return [];
    }
};
exports.transformPublication = (result = {}) => {
    return {
        property: result.message.property,
        publication: result.message.publication,
        tag: result.message.tag,
        isPilotZone: true // This property will be set from result once the api is ready
    };
};
//# sourceMappingURL=transforms.js.map