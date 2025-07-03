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

    async findTotalVoiceTimeTop3(guildId) {
        try {
            const rawData = await this.prisma.voiceStateLogs.groupBy({
                by: ['userId'], _sum: { durationMinutes: true },
                where: {
                    guildId: guildId
                },
                orderBy: {
                    _sum: {
                        durationMinutes: 'desc',
                    },
                },
                take: 3
            });

            const results = rawData.map(raw => ({
                userId: raw.userId,
                totalDuration: raw._sum.durationMinutes,
            }));
            return results;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = VoiceStateLogsRepository;