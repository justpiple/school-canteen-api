import * as bcrypt from "bcrypt";

const SALT_OR_ROUNDS = 11;

export async function encryptData(data: string) {
  return await bcrypt.hash(data, SALT_OR_ROUNDS);
}

export async function compareData(plainData: string, encryptedData: string) {
  return await bcrypt.compare(plainData, encryptedData);
}
