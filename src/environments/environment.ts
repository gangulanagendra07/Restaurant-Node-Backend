import { devEnvironment } from "./environment.dev";
import { prodEnvironment } from "./environment.prod";

export interface Environment {
  db_uri: string;
  jwt_secret_key: string;
}

export function getEnvironmentVariables() {
  if (process.env.NODE_ENV === "production") {
    return prodEnvironment;
  }
  return devEnvironment;
}
