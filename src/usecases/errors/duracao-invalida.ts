export class DuracaoInvalida extends Error {
  constructor() {
    super('Informe uma data de conclusão valida.')
  }
}
