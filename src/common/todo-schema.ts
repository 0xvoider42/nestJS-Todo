import * as Joi from 'joi';

export const addTodoBody = Joi.object({
  title: Joi.string().max(30).required(),
  text: Joi.string().required(),
});

export const updateTodoBody = Joi.object({
  title: Joi.string(),
  text: Joi.string(),
});
