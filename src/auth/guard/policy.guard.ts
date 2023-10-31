import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import {
  CHECK_POLICIES_KEY,
  IPolicyHandler,
  PolicyHandler,
} from '../decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('runnnn');
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    console.log('policyHandlers', policyHandlers);
    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}

// export class ReadNotePolicyHandler implements IPolicyHandler {
//   handle(ability: AppAbility) {
//     return ability.can(Action.Read, Note);
//   }
// }
