export type FieldError = string | null | undefined;
export type Gender = 'male' | 'female';
export type ProductGender = 'male' | 'female' | 'unisex';
export type AttributeControlType = 'DropdownList' | 'RadioList' | 'Checkboxes' | 'TextBox' | 'Color';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  isVendor: boolean;
  isRegistered: boolean;
  imageUrl: string;
  language: string;
}

export interface ICategory {
  name: string;
  seName: string;
  productsCount: number;
  _id: string;
}

export interface IPicture {
  imageUrl: string;
  _id: string;
}

export interface IPrice {
  old: number;
  price: number;
}

export interface IProductAttribute {
  _id: string;
  name: string;
  attributeControlType: AttributeControlType;
  values: IProductAttributeValue[];
}

export interface ICustomeProductAttribute {
  _id: string;
  values: { _id: string }[];
}

export interface IProductAttributeValue {
  _id: string;
  name: string;
  priceAdjustmentValue: number;
  colorRgb?: string;
}

export interface IProductReview {
  product?: IFullProduct;
  customer: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    _id: string;
  };
  reviewText: string;
  rating: number;
  _id: string;
  createdAt: string;
}

export interface IVendor {
  name: string;
  seName: string;
  imageUrl: string;
  productCount: number;
  followersCount: number;
  isFollowed: boolean;
  _id: string;
}

export interface ITag {
  name: string;
  seName: string;
  productCount: number;
  _id: string;
}

export interface IFullProduct {
  gender: string;
  category: ICategory;
  pictures: IPicture[];
  name: string;
  shortDescription: string;
  fullDescription: string;
  seName: string;
  sku: string;
  vendor: IVendor;
  price: IPrice;
  productTags: string[];
  productAttributes: IProductAttribute[];
  hasAttributes: boolean;
  productReviewOverview: {
    ratingSum: number;
    totalReviews: number;
  };
  likes: number;
  carts: number;
  saves: number;
  productReviews: IProductReview[];
  deleted: boolean;
  inStock: boolean;
  stock: number;
  _id: string;
  updatedAt: string;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isReviewed: boolean;
  isInCart: boolean;
}
