import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { CategoryType } from 'types/category.type';
import { SubCategoryType } from 'types/subCategory.type';
import { TrainerType } from 'types/trainer.type';
import { GraphQLUpload } from 'graphql-upload';
import { uploadInstance } from 'utils/upload';

export const TrainingType = new GraphQLObjectType({
  name: 'Training',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    priceAfterDiscount: { type: GraphQLString },
    idCategory: { type: CategoryType },
    idSubCategories: { type: new GraphQLList(SubCategoryType) },
    membersNumber: { type: GraphQLInt },
    discount: { type: GraphQLString },
    description: { type: GraphQLString },

    image: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) =>
        parent.image.length
          ? parent.image.map((e: string) => uploadInstance.convertKeyToS3Url(e))
          : ['https://doctorgaby.com/wp-content/uploads/2016/03/default-placeholder-570x570.png'],
    },
    idTrainer: { type: TrainerType },
  },
});
export const ImageType = new GraphQLInputObjectType({
  name: 'Image',
  fields: {
    first: { type: GraphQLBoolean },
    file: { type: GraphQLUpload },
  },
});
