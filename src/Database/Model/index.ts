import { getModelForClass } from '@typegoose/typegoose';
import { GuildSchema } from './Schematics';

export const GuildModel = getModelForClass(GuildSchema);
