import fastify from 'fastify';
import {StorageService} from './service/storage';

const server = fastify({
    logger: true
});

server.get('/', async (request, reply) => {
    reply.type('application/json').code(200);
    return {hello: 'world'};
});

server.get('/companies/:id', async (request:any, reply) => {
    StorageService.getCompanyById(request.params.id);
    reply.type('application/json').code(200);
    return {hello: request.params.id};
});

server.listen(3000, (err, address) => {
    if (err) throw err;
    server.log.info(`server listening on ${address}`);
});
