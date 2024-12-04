import { ModulePreview } from "./module.interface";

export interface UserData {
  id: string;
  modules: ModulePreview[];
  createdAt: Date;
}
