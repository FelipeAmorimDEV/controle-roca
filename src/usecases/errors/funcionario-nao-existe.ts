export class FuncionarioNaoExiste extends Error {
  constructor() {
    super('Funcionario não existe.')
  }
}
