import mongoose, { Document, Model, Schema } from 'mongoose';
import { category } from './category.model';
import { SubCategory } from './subCategory.model';
export interface image {
  first: boolean;
  file: string;
}

export interface Training {
  name?: string;
  price: string;
  priceAfterDiscount: string;
  idCategory?: category;
  idSubCategories?: SubCategory[];
  membersNumber: number;
  discount?: string;
  description?: string;
  image: string[];
  date: string;
  idTrainer?: string;
}

export interface trainingDocument extends Document, Training {}

export type trainingModel = Model<trainingDocument>;

const trainingSchema = new mongoose.Schema<trainingDocument, trainingModel>(
  {
    name: {
      type: String,
      trim: true,
      required: false,
    },
    price: {
      type: String,
      trim: true,
      required: true,
    },
    priceAfterDiscount: {
      type: String,
      trim: true,
      required: true,
    },
    idCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    idSubCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    membersNumber: {
      type: Number,
      trim: true,
      required: true,
    },
    discount: {
      type: String,
      trim: true,
      required: false,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },

    image: {
      type: [{ type: String, required: true }],
      required: false,
    },
    idTrainer: {
      type: Schema.Types.ObjectId,
      ref: 'Trainer',
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Training', trainingSchema);
