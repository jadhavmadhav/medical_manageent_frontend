import { apiRequestWithoutAuth } from "@/utils/axios";

 

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const response = await apiRequestWithoutAuth("post", "/signup", req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.response?.data?.message || "Signup failed" });
  }
}
