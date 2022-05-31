// import joi from 'joi';
import { GraphQLString, GraphQLID, GraphQLList, GraphQLError, GraphQLInt } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Training from 'models/training.model';

import { TrainingType } from 'types/training.type';
import { GraphQLUpload } from 'graphql-upload';

import apiWrapper from 'crud/apiWrapper';

import categoryModel from 'models/category.model';
import { uploadFileS3, uploadInstance } from 'utils/upload';
// import productService from 'services/product.service';

import { s3Url } from 'config/vars';
import trainingModel from 'models/training.model';

// const createtrainingValidation = {
//   name: joi.string().min(1).max(50).required(),
//   price: joi.string().max(10).required(),
//   idCategory: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   idSubCategories: joi
//     .array()
//     .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
//     .required(),
//   quantity: joi.number().required(),
//   discount: joi.string().required(),
//   keywords: joi.string().required(),
//   description: joi.string().required(),
//   referenceClient: joi.string().required(),
//   image: joi.array().items(),
//   idShop: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
// };

// const updatetrainingValidation = {
//   name: joi.string().min(1).max(50),
//   price: joi.string().max(10),
//   idCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
//   idSubCategories: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
//   quantity: joi.number(),
//   discount: joi.string(),
//   keywords: joi.string(),
//   description: joi.string(),
//   referenceClient: joi.string(),
//   image: {},
//   idShop: joi.string().regex(/^[0-9a-fA-F]{24}$/),
// };

export default {
  createTraining: create(
    Training,
    {
      name: { type: GraphQLString, required: false },
      price: { type: GraphQLString, required: true },
      idCategory: { type: GraphQLID, required: false },
      idSubCategories: { type: new GraphQLList(GraphQLID), required: false },
      quantity: { type: GraphQLInt, required: true },
      discount: { type: GraphQLString, required: false },
      keywords: { type: GraphQLString, required: false },
      description: { type: GraphQLString, required: false },
      referenceClient: { type: GraphQLString, required: false },
      image: { type: new GraphQLList(GraphQLUpload), required: false },
    },
    TrainingType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async (args, req) => {
        const { image, ...rest } = args;

        const idCategory = await categoryModel.findById(rest.idCategory);
        const trainingDest = `public/${trainingModel?.name}/`;

        if (image?.length) {
          return await Promise.all(
            image?.map(async (file) => {
              if (file) return await uploadFileS3(trainingDest, file);
            }),
          );
          // .then(
          //   // async (res) =>
          //     // await trainingService.createTrainingArgs({ ...rest, idShop: shop, idCategory, image: res } as any),
          // );
        }
        // return await productService.createProductArgs({ ...rest, idShop: shop, idCategory } as any);
      },

      post: ({
        result: {
          image,
          _id,
          name,
          idCategory,
          idSubCategories,
          price,

          description,
        },
      }) => {
        return {
          id: _id,
          image: image,
          name,
          price,
          idCategory,
          idSubCategories,

          description,
        };
      },
    },
  ),
  updateTraining: update(
    Training,
    {
      id: GraphQLID,
      name: GraphQLString,
      price: GraphQLString,
      idCategory: GraphQLID,
      idSubCategories: new GraphQLList(GraphQLID),
      quantity: GraphQLInt,
      discount: GraphQLString,
      keywords: GraphQLString,
      description: GraphQLString,
      referenceClient: GraphQLString,
      image: new GraphQLList(GraphQLUpload),
    },
    TrainingType,
    {
      authorizationRoles: [Role.ADMIN, Role.OWNER],
      pre: async (args, req) => {
        const { image, ...rest } = args;

        if (image?.length) {
          // Deleting Old Photos
          const product = await Training.findOne({ _id: rest.id }).select('image');

          const productDest = `public/${trainingModel?.name}/`;

          return await Promise.all(
            image.map(async (file) => {
              if (file) return await uploadFileS3(productDest, file);
            }),
          ).then((res) => ({
            ...rest,
            image: product?.image.concat(res),
            // priceAfterDiscount,
          }));
        } else return { ...rest };
      },
    },
  ),
  removeTraining: remove(Training, { authorizationRoles: [Role.ADMIN, Role.OWNER] }),
  deleteImage: apiWrapper(
    async (args) => {
      const { file, id } = args;
      const training = await Training.findById(id);
      const updatesArrayOdimages = training?.image.filter((img) => {
        if (!file?.includes(`${s3Url}/${img}`)) {
          return true;
        } else {
          uploadInstance.removeObject(img);
          return false;
        }
      }) as any;
      await Training.findByIdAndUpdate(id, {
        image: updatesArrayOdimages,
      });
      if (!training) throw new GraphQLError('invalid training id');

      return 'image deleted';
    },
    GraphQLString,
    {
      id: { type: GraphQLID },
      file: { type: GraphQLList(GraphQLString) },
    },
  ),
};
