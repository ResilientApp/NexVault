import {
  NamespacedActions as UserActions,
  NamespacedMutations as UserMutations,
} from "./user";

import {
  NamespacedActions as NetworkActions,
  NamespacedMutations as NetworkMutations,
} from "./network";

import {
  NamespacedActions as AccountActions,
  NamespacedMutations as AccountMutations,
} from "./account";

export type AllNamespacedActions = UserActions &
  NetworkActions &
  AccountActions;

export type AllNamespacedMutations = UserMutations &
  NetworkMutations &
  AccountMutations;
