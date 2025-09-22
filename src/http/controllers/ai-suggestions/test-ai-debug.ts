import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

export async function testAIDebug(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    console.log('=== TESTE DE DEBUG IA ===');
    
    // Extrai fazendaId do token JWT
    const user = (request as any).user;
    console.log('User do token:', user);
    
    const fazendaId = user?.fazenda_id;
    console.log('Fazenda ID extraída:', fazendaId);
    
    if (!fazendaId) {
      return reply.status(400).send({
        error: 'Não foi possível extrair fazendaId do token JWT'
      });
    }

    // Testa busca de setores
    console.log('Buscando setores da fazenda...');
    const setores = await prisma.setor.findMany({
      where: { fazenda_id: fazendaId },
      take: 3 // Limita a 3 setores para teste
    });
    console.log('Setores encontrados:', setores.length);

    if (setores.length === 0) {
      return reply.status(200).send({
        success: true,
        message: 'Nenhum setor encontrado para esta fazenda',
        fazendaId,
        setores: []
      });
    }

    // Testa busca de aplicações do primeiro setor
    const primeiroSetor = setores[0];
    console.log('Testando setor:', primeiroSetor.id);
    
    const aplicacoes = await prisma.aplicacao.findMany({
      where: {
        setorId: primeiroSetor.id,
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 ano atrás
        }
      },
      take: 2 // Limita a 2 aplicações para teste
    });
    
    console.log('Aplicações encontradas:', aplicacoes.length);
    
    if (aplicacoes.length > 0) {
      const primeiraAplicacao = aplicacoes[0];
      console.log('Primeira aplicação:', {
        id: primeiraAplicacao.id,
        produtosAplicados: primeiraAplicacao.produtosAplicados,
        tipo: typeof primeiraAplicacao.produtosAplicados
      });
    }

    // Testa busca de fertirrigações
    const fertirrigacoes = await prisma.fertirrigacao.findMany({
      where: {
        setor_id: primeiroSetor.id,
        created_at: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 ano atrás
        }
      },
      take: 2 // Limita a 2 fertirrigações para teste
    });
    
    console.log('Fertirrigações encontradas:', fertirrigacoes.length);

    return reply.status(200).send({
      success: true,
      message: 'Debug concluído com sucesso',
      fazendaId,
      setores: setores.map(s => ({
        id: s.id,
        nome: s.setorName,
        dataPoda: s.dataPoda
      })),
      aplicacoes: aplicacoes.length,
      fertirrigacoes: fertirrigacoes.length,
      debug: {
        primeiroSetor: {
          id: primeiroSetor.id,
          nome: primeiroSetor.setorName,
          dataPoda: primeiroSetor.dataPoda
        },
        primeiraAplicacao: aplicacoes.length > 0 ? {
          id: aplicacoes[0].id,
          produtosAplicados: aplicacoes[0].produtosAplicados,
          tipo: typeof aplicacoes[0].produtosAplicados
        } : null
      }
    });

  } catch (error) {
    console.error('Erro no debug:', error);
    return reply.status(500).send({
      error: 'Erro no debug',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
