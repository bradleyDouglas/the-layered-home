//Molecules
import portfolioRowOne from "./molecules/portfolioRowOne";
import portfolioRowTwo from "./molecules/portfolioRowTwo";
import portfolioRowThree from "./molecules/portfolioRowThree";
const molecules = [portfolioRowOne, portfolioRowTwo, portfolioRowThree];

// Blocks
import fullWidthImage from "./blocks/fullWidthImage";
import twoImages from "./blocks/twoImages";
import blockQuote from "./blocks/blockQuote";
const blocks = [fullWidthImage, twoImages, blockQuote];

// Documents
import service from "./documents/service";
import portfolio from "./documents/portfolio";
import author from "./documents/author";
import tag from "./documents/tag";
import blogPost from "./documents/blogPost";
const documents = [service, portfolio, author, tag, blogPost];

export const schemas = [...documents, ...molecules, ...blocks];
