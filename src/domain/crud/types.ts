export type EntityId = string;

export interface CrudRepository<T, CreateInput, UpdateInput = Partial<T>> {
  list: () => T[];
  get: (id: EntityId) => T | undefined;
  create: (input: CreateInput) => T;
  update: (id: EntityId, input: UpdateInput) => T | undefined;
  remove: (id: EntityId) => boolean;
}

export type ListFilter<T> = (item: T) => boolean;
