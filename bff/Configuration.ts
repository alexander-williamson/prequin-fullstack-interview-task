import "dotenv/config";
import joi from "joi";

function GetConfiguration(): Configuration {
  const { value, error } = joi
    .object<Configuration>({
      ORIGIN: joi.string().required(),
      PORT: joi.number().required(),
      NODE_ENV: joi.string().valid("local", "test", "production").required(),
      DATABASE_HOST: joi.string().required(),
      DATABASE_USERNAME: joi.string().required(),
      DATABASE_PASSWORD: joi.string().required(),
      DATABASE_NAME: joi.string().required(),
    })
    .unknown()
    .validate(process.env, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw error;
  }

  return value as Configuration;
}

export type Configuration = {
  ORIGIN: string;
  PORT: number;
  NODE_ENV: string;
  DATABASE_HOST: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
};

export const configuration = GetConfiguration();
