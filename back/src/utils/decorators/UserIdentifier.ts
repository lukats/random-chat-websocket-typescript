import { validate } from 'email-validator'
import { GraphQLScalarType } from 'graphql/type'
import { Kind } from 'graphql/language'

export interface Identifier {
  email: string | null
  username: string | null
}

export interface UserId {
  email?: string
  username?: string
}

export const IdentifierScalar = new GraphQLScalarType({
  name: 'Identifier',
  description: 'User input login, (email | username)',
  serialize({ email, username }: Identifier): UserId {
    if (username) {
      const l = username.length
      if (l >= 1 && l <= 30) return { username }
    }
    if (email && validate(email)) return { email }

    return {}
  },
  parseValue(ids: Identifier): UserId {
    if (ids.username) {
      const l = ids.username.length
      if (l >= 1 && l <= 30) return { username: ids.username }
    }
    if (ids.email && validate(ids.email)) return { email: ids.email }

    return {}
  },
  parseLiteral(ast): UserId {
    if (ast.kind !== Kind.STRING) {
      throw new Error('IdentifierScalar can only parse string values')
    }
    let parsedValue
    try {
      parsedValue = JSON.parse(ast.value)
    } catch (error) {
      throw new Error(
        'IdentifierScalar can only parse stringed Identifier values'
      )
    }
    if (parsedValue.username) {
      const l = parsedValue.username.length
      if (l >= 1 && l <= 30) return { username: parsedValue.username }
    }
    if (parsedValue.email && validate(parsedValue.email))
      return { email: parsedValue.email }

    return {}
  }
})
