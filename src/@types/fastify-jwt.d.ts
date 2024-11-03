import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { fazenda_id: string; fazendaNome: string } // payload type is used for signing and verifying
    user: {
      sub: string
      fazenda_id: string
    } // user type is return type of `request.user` object
  }
}
