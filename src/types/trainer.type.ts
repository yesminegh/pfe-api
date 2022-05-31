import { GraphQLBoolean, GraphQLID, GraphQLObjectType } from 'graphql';

export const TrainerType = new GraphQLObjectType({
  name: 'Trainer',
  fields: {
    id: { type: GraphQLID },
    availablity: { type: GraphQLBoolean },
  },
});
