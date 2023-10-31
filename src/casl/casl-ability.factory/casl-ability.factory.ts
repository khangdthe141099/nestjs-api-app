import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

export enum Action {
  Manage = 'MANAGE',
  Create = 'CREATE',
  Read = 'READ',
  Update = 'UPADTE',
  Delete = 'DELETE',
}

class User {
  id: number;
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
}

class Note {
  id: number;
  title: string;
  description: string;
  url: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

type Subjects = InferSubjects<typeof User | typeof Note> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user?.role === 'ADMIN') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Note, { userId: user?.id });
    cannot(Action.Delete, Note, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item?.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
