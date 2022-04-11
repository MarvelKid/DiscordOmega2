import { prop } from '@typegoose/typegoose';

interface Guild {
  guildId: string;
}

class GuildSchema implements Guild {
  @prop({ type: () => String, required: true })
  public readonly guildId: string;
}

export { GuildSchema };
