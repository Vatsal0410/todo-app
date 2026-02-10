"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}
