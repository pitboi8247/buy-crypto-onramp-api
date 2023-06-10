require('dotenv').config()
import * as z from 'zod';

const envsSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),
  PORT: z.string().default('8080'),
  MERCURYO_SECRET_KEY: z.string({ required_error: "Mercuryo secret key required for url signing"}).nonempty(),
  MOONPAY_TEST_SECRET_KEY: z.string({ required_error: "Mercuryo secret key required for url signing"}).nonempty(),
  PRIVATE_KEY: z.string({ required_error: "Private key required for binance connect url signing"}).nonempty(),
}).nonstrict();

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MERCURYO_SECRET_KEY: process.env.MERCURYO_SECRET_KEY,
  MOONPAY_TEST_SECRET_KEY: process.env.MOONPAY_TEST_SECRET_KEY,    
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};

try {
  const validatedEnvs = envsSchema.parse(envVars);
  console.log(validatedEnvs);
} catch (error) {
  console.error('Error validating environment variables:', error);
}


// map env vars and make it visible outside module
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mercuryoSecretKey: envVars.MERCURYO_SECRET_KEY,
  moonpaySecretKey: envVars.MOONPAY_TEST_SECRET_KEY,
  privateKey: envVars.PRIVATE_KEY,
};