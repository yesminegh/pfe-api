import mongoose, { Document, Model } from 'mongoose';

export interface Trainer {
  availablity: boolean;
}

export interface TrainerDocument extends Document, Trainer {}
export type TrainerModel = Model<TrainerDocument>;

const trainerSchema = new mongoose.Schema<TrainerDocument, TrainerModel>({
  availablity: {
    type: Boolean,
    trim: true,
    required: true,
  },
});

export default mongoose.model('Client', trainerSchema);
