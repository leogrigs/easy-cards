import { Card } from "./card.interface";

export interface Module {
  id: string;
  name: string;
  public: boolean;
  description?: string;
  ownerId: string;
  cards: Card[];
}

export interface ModulePreview {
  id: string;
  name: string;
}
