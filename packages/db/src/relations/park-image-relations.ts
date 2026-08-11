import { relations } from 'drizzle-orm'
import { parkImages, parks } from '../index'

export const parkImageRelations = relations(parkImages, ({one}) => ({
    park: one(parks, {
        fields: [parkImages.parkId],
        references: [parks.id],
    })
}))