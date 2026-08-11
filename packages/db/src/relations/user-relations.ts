
import { relations } from 'drizzle-orm'

import { parks, users } from '../index'


export const userRelations = relations(users, ({ many }) => ({
    parks: many(parks)
}))