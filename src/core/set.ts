import {
  zodTokens,
  zodSetMembers,
  zodIdentifier,
  callExpressionCreatorWithTarget,
  callExpressionCreatorWithFactoryType
} from "../utils";
import { buildSharedZodMemberCreators } from "./shared";

export const createZodSet = callExpressionCreatorWithTarget(
  zodIdentifier,
  zodTokens.set
);

export const setMemberCreators = {
  min: callExpressionCreatorWithFactoryType(zodTokens.min, zodTokens.set),
  max: callExpressionCreatorWithFactoryType(zodTokens.max, zodTokens.set),
  size: callExpressionCreatorWithFactoryType(zodTokens.size, zodTokens.set),
  nonempty: callExpressionCreatorWithFactoryType(
    zodTokens.nonempty,
    zodTokens.set
  )
} as const satisfies Partial<Record<keyof typeof zodSetMembers, any>>;

export const _set = Object.assign(createZodSet, {
  t: Object.assign(
    setMemberCreators,
    buildSharedZodMemberCreators(zodTokens.set)
  )
});
