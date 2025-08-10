import { apiRequestWithoutAuth } from "@/utils/axios";

 

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const response = await apiRequestWithoutAuth("post", "/signup", req.body);
    res.status(201).json(response.data);
  } catch (error) {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response?.data?.message === "string"
        ? (error as any).response.data.message
        : "Signup failed";
    res.status(400).json({ message: errorMessage });
  }
}
