import * as utils from './imageUtils';

describe('imageUtils', () => {
  describe('getDynamicMediaUrl()', () => {
    beforeEach(() => {
      (global as any).process = {
        env: {
          DYNAMIC_MEDIA_DOMAIN: 'https://dynamicmedia.zuza.com',
          MEDIA_ZUZA_DOMAIN: 'http://media.zuza.com'
        }
      };
    });

    it('should return false if error is thrown', () => {
      const result = utils.getDynamicMediaUrl(undefined, '');
      expect(result).toBe(undefined);
    });

    it('should replace media zuza domain with dynamic media domain', () => {
      const result = utils.getDynamicMediaUrl(
        'http://media.zuza.com/b/f/bfa7ca4b-178c-4be3-97df-4cea6071df22/N_Helicopter_image_of_arrest___Large_Thumb.jpg',
        'cropped_345x190'
      );
      expect(result).toContain(process.env.DYNAMIC_MEDIA_DOMAIN);
      expect(result).not.toContain(process.env.MEDIA_ZUZA_DOMAIN);
    });

    it('should insert crop value in url', () => {
      const result = utils.getDynamicMediaUrl(
        'http://media.zuza.com/b/f/bfa7ca4b-178c-4be3-97df-4cea6071df22/N_Helicopter_image_of_arrest___Large_Thumb.jpg',
        'cropped_345x190'
      );
      expect(result).toContain('cropped_345x190');
    });

    it('should return dynamic media url for image', () => {
      const result = utils.getDynamicMediaUrl(
        'http://media.zuza.com/b/f/bfa7ca4b-178c-4be3-97df-4cea6071df22/N_Helicopter_image_of_arrest___Large_Thumb.jpg',
        'cropped_345x190'
      );
      expect(result).toBe(
        'https://dynamicmedia.zuza.com/zz/m/cropped_345x190/b/f/bfa7ca4b-178c-4be3-97df-4cea6071df22/N_Helicopter_image_of_arrest___Large_Thumb.jpg'
      );
    });

    it('should url encode image name', () => {
      const result = utils.getDynamicMediaUrl(
        'http://media.zuza.com/0/a/0a2c4aae-cffe-4911-8cd9-cd7db68d3c54/YRP Jackets Stock image_Super_Portrait.jpg',
        'cropped_345x190'
      );
      expect(result).toBe(
        'https://dynamicmedia.zuza.com/zz/m/cropped_345x190/0/a/0a2c4aae-cffe-4911-8cd9-cd7db68d3c54/YRP%20Jackets%20Stock%20image_Super_Portrait.jpg'
      );
    });
  });
});
