"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("./transforms"));
const mockNavJson = __importStar(require("../../__mocks__/data/zuza-navigation-response.json"));
const mockArticlesJson = __importStar(require("../../__mocks__/data/zuza-articles-response.json"));
const mockPublicationJson = __importStar(require("../../__mocks__/data/thestar-publication-response.json"));
describe('transforms', () => {
    describe('transformNavigation()', () => {
        it('should return empty array if typeof results != Array', () => {
            const results = t.transformNavigation();
            expect(results).toEqual([]);
        });
        it('should return an array of valid PrimaryNavItems', () => {
            const results = t.transformNavigation(mockNavJson);
            results.forEach((item, index) => {
                expect(item.label).toEqual(mockNavJson.items[index].titleOverride);
            });
        });
        it('should set PrimaryNavItem.children = [] if navigationItems not defined', () => {
            const mockCopy = JSON.parse(JSON.stringify(mockNavJson));
            mockCopy.items[0].navigationItems = undefined;
            const results = t.transformNavigation(mockCopy);
            expect(results[0].children).toEqual([]);
        });
        it('should set PrimaryNavItem.children = navigationItems if defined', () => {
            const results = t.transformNavigation(mockNavJson);
            expect(results[0].children.length).toEqual(mockNavJson.items[0].navigationItems.length);
        });
    });
    describe('transformSecondaryNavItems()', () => {
        let items = [];
        beforeEach(() => (items = mockNavJson.items[0].navigationItems));
        it('should return empty array if items is not defined', () => {
            const results = t.transformSecondaryNavItems();
            expect(results).toEqual([]);
        });
        it('should return an array of valid SecondaryNavItems', () => {
            const results = t.transformSecondaryNavItems(items);
            results.forEach((item, index) => {
                expect(item.label).toEqual(items[index].label);
                expect(item.navigationUrl).toEqual(items[index].navigationUrl);
                expect(item.enabled).toEqual(items[index].enabled);
                expect(item.openNewWindow).toEqual(items[index].openNewWindow);
                expect(item.noFollow).toEqual(items[index].noFollow);
            });
        });
    });
    describe('transformArticleItems()', () => {
        it('should return empty array if an error occurs', () => {
            global.console.error = jest.fn();
            const results = t.transformArticleItems({ assetId: '1' });
            expect(results).toEqual([]);
        });
        it('should return empty array if items is not defined', () => {
            const results = t.transformArticleItems();
            expect(results).toEqual([]);
        });
        it('should return an array of valid NewsItems', () => {
            const items = mockArticlesJson.items;
            const results = t.transformArticleItems(items);
            results.forEach((item, index) => {
                expect(item.assetId).toEqual(items[index].assetId);
                expect(item.title).toEqual(items[index].title);
                expect(item.description).toEqual(items[index].description);
                expect(item.imageAlt).toEqual(items[index].imageAlt);
                expect(item.category).toEqual(items[index].category);
                expect(item.displayPublishDate).toEqual(items[index].displayPublishFromDate);
                expect(item.navigationUrl).toEqual(items[index].detailUrl);
                expect(item.openNewWindow).toEqual(items[index].detailNewWindow);
                expect(item.thumbnails.small).toBeDefined();
                expect(item.thumbnails.large).toBeDefined();
            });
        });
    });
    describe('transfromPublication()', () => {
        it('Should return a valid publication data', () => {
            const apiResponse = mockPublicationJson;
            const result = t.transformPublication(apiResponse);
            expect(result.property).toEqual(apiResponse.message.property);
            expect(result.publication).toEqual(apiResponse.message.publication);
            expect(result.tag).toEqual(apiResponse.message.tag);
            expect(result.isPilotZone).toEqual(true); // this value is expected to change once the publciation api is ready.
        });
    });
});
//# sourceMappingURL=transforms.test.js.map