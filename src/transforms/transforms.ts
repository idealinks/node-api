import { getDynamicMediaUrl } from '../utils/imageUtils';

export const transformNavigation = (results: any = {}) => {
  if (!Array.isArray(results.items)) {
    return [];
  }

  return results.items.map(item => {
    return {
      label: item.titleOverride,
      children: transformSecondaryNavItems(item.navigationItems)
    };
  });
};

export const transformSecondaryNavItems = (items = []) => {
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

export const transformArticleItems = (items = []) => {
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
        small: getDynamicMediaUrl(item.imageUrl, 'cropped_90x90'),
        large: getDynamicMediaUrl(item.imageUrl, 'cropped_300x200')
      }
    }));
  } catch (err) {
    console.error('Error: transfroming articles', err);
    return [];
  }
};

export const transformPublication = (result: any = {}) => {
  return {
    property: result.message.property,
    publication: result.message.publication,
    tag: result.message.tag,
    isPilotZone: true // This property will be set from result once the api is ready
  };
};
