import { ItemStatus } from '@/generated/prisma/enums'
import { type User } from 'better-auth'
import { LucideIcon } from 'lucide-react'
import z from 'zod'

export interface NavPrimaryProps {
  items: {
    title: string
    to: string
    icon: LucideIcon
    activeOptions: { exact: boolean }
  }[],

}

export interface NavUserProps {
  user: User
}


 export const itemSearchSchema = z.object({
  q:z.string().default(''),
  status: z.union([z.literal('all'), z.nativeEnum(ItemStatus)]).default('all') // or // status: z.enum(['ALL', ...Object.values(ItemStatus)]).default('ALL')
})
 export type ItemSearch = z.infer<typeof itemSearchSchema>
