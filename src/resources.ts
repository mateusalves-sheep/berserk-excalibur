import { Loader, ImageSource } from "excalibur";

export const Resources: Record<string, ImageSource> = {};

export const loader = new Loader();
for (const res of Object.values(Resources) as ImageSource[]) {
  loader.addResource(res);
}