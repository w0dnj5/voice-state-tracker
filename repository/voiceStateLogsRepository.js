const { PrismaClient } = require('../generated/prisma');
class VoiceStateLogsRepository {

    constructor(prisma = PrismaClient) {
        this.prisma = prisma;
    }

    async createLog(data) {
        try {
            await this.prisma.voiceStateLogs.create({
                data: {
                    userId: data.userId,
                    guildId: data.guildId,
                    connectAt: data.connectAt,
                    disconnectAt: data.disconnectAt,
                    durationMinutes: data.durationMinutes
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = VoiceStateLogsRepository;