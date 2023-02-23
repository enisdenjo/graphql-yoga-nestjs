import { Kind, ValueNode } from 'graphql';
import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('Date', _type => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    return new Date(Number(value)); // value from the client
  }

  serialize(value: unknown): number {
    return (value as Date).getTime(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.INT) {
      throw new Error(`Date cannot be parsed from ${ast.kind}`);
    }
    return new Date(ast.value);
  }
}
