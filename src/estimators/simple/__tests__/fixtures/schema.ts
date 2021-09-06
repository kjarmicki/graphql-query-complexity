/**
 * Created by Ivo Meißner on 28.07.17.
 */

import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLScalarType,
} from 'graphql';

const Item: GraphQLObjectType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    variableList: {
      type: Item,
      args: {
        count: {
          type: GraphQLInt,
        },
      },
    },
    scalar: { type: GraphQLString },
    list: { type: new GraphQLList(Item) },
    nonNullItem: {
      type: new GraphQLNonNull(Item),
      resolve: () => ({}),
    },
    nonNullList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Item))),
      resolve: () => [],
    },
  }),
});

const NameInterface = new GraphQLInterfaceType({
  name: 'NameInterface',
  fields: {
    name: { type: GraphQLString },
  },
  resolveType: () => Item,
});

const SecondItem = new GraphQLObjectType({
  name: 'SecondItem',
  fields: () => ({
    name: { type: GraphQLString },
    scalar: { type: GraphQLString },
  }),
  interfaces: [NameInterface],
});

const EnumType = new GraphQLEnumType({
  name: 'RGB',
  values: {
    RED: { value: 0 },
    GREEN: { value: 1 },
    BLUE: { value: 2 },
  },
});

const Union = new GraphQLUnionType({
  name: 'Union',
  types: [Item, SecondItem],
  resolveType: () => Item,
});

const ErrorThrower = new GraphQLObjectType({
  name: 'ErrorType',
  fields: {
    errorScalar: {
      type: new GraphQLObjectType({
        name: 'ErrorScalar',
        fields: { irrelevant: { type: GraphQLString } },
      }),
      args: {
        throws: {
          type: new GraphQLScalarType({
            name: 'Throws',
            parseValue() {
              throw new Error('Scalar parse error');
            },
            parseLiteral() {
              throw new Error('Scalar parse error');
            },
            serialize() {
              return '';
            },
          }),
        },
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    name: { type: GraphQLString },
    variableList: {
      type: Item,
      args: {
        count: {
          type: GraphQLInt,
        },
      },
    },
    interface: { type: NameInterface },
    enum: { type: EnumType },
    scalar: { type: GraphQLString },
    union: { type: Union },
    variableScalar: {
      type: Item,
      args: {
        count: {
          type: GraphQLInt,
        },
      },
    },
    list: { type: new GraphQLList(Item) },
    nonNullItem: {
      type: new GraphQLNonNull(Item),
      resolve: () => ({}),
    },
    nonNullList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Item))),
      resolve: () => [],
    },
    requiredArgs: {
      type: Item,
      args: {
        count: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
    },
    errorThrower: {
      type: ErrorThrower,
    },
  }),
});

export default new GraphQLSchema({ query: Query });
