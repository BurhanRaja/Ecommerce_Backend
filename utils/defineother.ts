import { Types } from "mongoose";
import { IDiscount } from "./defineModels.js";

export interface ProductDetails {
  price?: number | string;
  seller?: string;
  seller_info_id?: string;
  product?: string;
  quantity?: number | string;
  product_info: {
    size?: string;
    color?: string;
    info_type?: string;
    thumbnail?: string;
  };
  is_ordered: boolean;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
  parent_id?: string;
}

export interface UpdateParentCategory {
  name?: string;
  description?: string;
}

export interface UpdateProduct {
  name?: string;
  images_info?: Array<any>;
  description: string;
  thumbnail: string;
  category_id: string;
  parent_category_id: string;
  sub_category_id: string;
}

export interface ProductFilter {
  seller_info?: {
    $in: Array<string>;
  };
  parent_category_id?: string;
  category_id?: {
    $in: Array<string>;
  };
  sub_category_id?: {
    $in: Array<string>;
  };
  images_info?: {
    price: {
      $gte: number;
      $lte: number;
    };
  };
  review?: {
    ratings: {
      $lte: number;
    };
  };
}

// For Product Filters
export interface PopulatedDiscount {
  discount: IDiscount | null;
}

export interface UpdateDiscount {
  description?: string;
  discount_percentage?: number | string;
  is_active?: boolean;
  products?: Array<string>;
}

export interface ImageInfoFilter {
  _id?: string;
  color?: string;
}

export interface NewFilterImageInfo {
  $elemMatch: ImageInfoFilter;
}

export interface SubCategoryFilter {
  parent_category_id: string;
  category_id?: {
    $in: Array<string>;
  };
}

export interface UpdateSubCategory {
  name?: string;
  description?: string;
  parent_category_id: Types.ObjectId;
  category_id: Types.ObjectId;
}

export interface UpdateSellerInfo {
  company_name?: string;
  company_type?: string;
  company_website?: string;
  phone?: string;
}

export interface UpdateSeller {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: number;
}
