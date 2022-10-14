import * as Joi from 'joi';

const schema = Joi.object({
  id: Joi.string().max(10),
  title: Joi.string().max(30),
  text: Joi.string(),
});

export default schema;
