import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import prisma from '../../../prisma/client'
import { MachineStatus } from '../../../prisma/client/mission';

@Controller('machine')
export class MachineController {
    @MessagePattern({ service: 'machine', cmd: 'register' })
    async register(data: { player_id: string; machine_code: string }) {
        const machine = await prisma.machine
            .findFirstOrThrow({ where: { code: data.machine_code } })
            .catch(e => { throw new RpcException(e.message) });
        await prisma.machine.update({
            where: {
                id: machine.id,
                status: MachineStatus.AVAILABLE,
                player_id: null,
                code: data.machine_code
            },
            data: {
                player_id: data.player_id,
                status: MachineStatus.USED
            }
        }).catch(e => { throw new RpcException(e.message) });
        return { machine: machine.id };
    }
}
