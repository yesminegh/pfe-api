import create from 'crud/create';
import remove from 'crud/remove';
import update from 'crud/update';
import { GraphQLID } from 'graphql';
// import joi from 'joi';
import trainingParticipation from 'models/trainingParticipation.model';
import { TrainingParticipationType } from 'types/traininParticipation.type';

// const createTrainingParticipationValidation = {
//   idProduct: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   quantity: joi.number().required(),
//   totalPrice: joi.string(),
// };

// const updateTrainingParticipationValidation = {
//   idProduct: joi.string().regex(/^[0-9a-fA-F]{24}$/),
//   quantity: joi.number(),
//   totalPrice: joi.string(),
// };

export default {
  createTrainingParticipation: create(
    trainingParticipation,
    {
      idTraining: { type: GraphQLID, required: true },
      idClient: { type: GraphQLID, required: true },
    },
    TrainingParticipationType,
    { validateSchema: {}, authorizationRoles: [] },
  ),
  // updateTrainingParticipation: update(
  //   trainingParticipation,
  //   { idTraining: GraphQLID, quantity: GraphQLInt, totalPrice: GraphQLString, idOrder: GraphQLID },
  //   TrainingParticipationType,
  //   { validateSchema: {}, authorizationRoles: [] },
  // ),
  removeTrainingParticipation: remove(trainingParticipation, { authorizationRoles: [] }),
};
