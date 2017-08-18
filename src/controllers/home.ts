import { Request, Response } from "express";

export let index = (req: Request, res: Response) => {
  res.send("Welcome to my Page from TS server.");
};
