const { PrismaClient } = require('../generated/prisma');
class VoiceStateLogsRepository {

    constructor(prisma = PrismaClient) {
        this.prisma = prisma;
    }


    async createVoiceStateLogs(data) {
        try {
            const { count } = await this.prisma.voiceStateLogs.createMany({
                data: data
            });

            return count;
        } catch (error) {   
            console.log(error);
        }
    }

    async findTotalVoiceTimeRank(guildId) {
        try {
            const result = await this.prisma.$queryRaw`
                SELECT
                    user_id,
                    SUM(TIMESTAMPDIFF(MINUTE, connected_at, disconnected_at)) AS duration_minutes
                FROM
                    voice_state_logs
                WHERE
                    guild_id = ${guildId}
                GROUP BY
                    user_id
                ORDER BY
                    duration_minutes DESC
                LIMIT
                    3
            `;

            const data = result.map(r => ({
                userId: r.user_id,
                durationMinutes: r.duration_minutes,
            }));
            return data;

        } catch (error) {
            console.log(error);
        }
    }

    async findThisMonthVoiceTimeRank(guildId, start, end) {
        try {
            const result = await this.prisma.$queryRaw`
                SELECT
                    user_id,
                    SUM(TIMESTAMPDIFF(MINUTE, connected_at, disconnected_at)) AS duration_minutes
                FROM
                    voice_state_logs
                WHERE
                    disconnected_at BETWEEN ${start} AND ${end}
                    AND guild_id = ${guildId}
                GROUP BY
                    user_id
                ORDER BY
                    duration_minutes DESC
                LIMIT
                    3
            `;

            const data = result.map(r => ({
                userId: r.user_id,
                durationMinutes: r.duration_minutes,
            }));
            return data;

        } catch (error) {
            console.log(error);
        }
    }

    async deleteLogsByGuildId(guildId) {
        try {
            await this.prisma.voiceStateLogs.deleteMany({
                where: {
                    guildId: guildId
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = VoiceStateLogsRepository;