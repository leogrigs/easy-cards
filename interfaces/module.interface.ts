import { ICard } from "./card.interface";

export interface Module extends ModulePreview {
  cards: ICard[];
}

export interface ModulePreview {
  id: string;
  name: string;
  public: boolean;
  description?: string;
  ownerId: string;
}
