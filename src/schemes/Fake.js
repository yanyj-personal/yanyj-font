import mongoose from 'mongoose';

export const Fake = mongoose.model('Fake', new mongoose.Schema({
  name: {
    id: String,
    unique: true,
    require: true,
  },
  title: {
    type: String,
  },
  owner: {
    type: String,
  },
  avatar: {
    type: String,
  },
  cover: {
    type: String,
  },
  status: {
    type: String,
  },
  percent: {
    type: String,
  },
  logo: {
    type: String,
  },
  href: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  subDescription: {
    type: String,
  },
  description: {
    type: String,
  },
  newUser: {
    type: String,
  },
  activeUser: {
    type: String,
  },
  star: {
    type: String,
  },
  like: {
    type: String,
  },
  message: {
    type: String,
  },
  content: {
    type: String,
  },
  members: {
    type: Array,
  },
}));

