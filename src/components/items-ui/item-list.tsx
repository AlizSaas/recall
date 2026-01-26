 import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import { getItemsFn } from '@/data/items'

import { copyToClipboard } from '@/lib/clipboard'
import { ItemSearch } from '@/lib/types'

import {  Link } from '@tanstack/react-router'
import { CopyIcon, Inbox } from 'lucide-react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { use } from 'react'
import { Skeleton} from '../ui/skeleton'


 
 export default function ItemList({q,status,data}:{q:ItemSearch['q'], status: ItemSearch['status'], data: ReturnType<typeof getItemsFn>}) {

    const items = use(data)

   const filteredItems = items.filter((item) => {
  // Early return for better performance
  if (status !== 'all' && item.status !== status) return false
  
  if (!q) return true // Skip search if no query
  
  const lowerQ = q.toLowerCase()
  return item.title?.toLowerCase().includes(lowerQ) || 
         item.tags?.some(tag => tag.toLowerCase().includes(lowerQ))
})

if (filteredItems.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="size-12" />
          </EmptyMedia>
          <EmptyTitle>
            {filteredItems.length === 0 ? 'No Items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {filteredItems.length === 0
              ? 'Import a URL to get started with saving your content.'
              : 'No items match your current search filters.'}
          </EmptyDescription>
        </EmptyHeader>
        {filteredItems.length === 0 && (
          <EmptyContent>
            <Link className={buttonVariants()} to="/dashboard/import">
              Import URL
            </Link>
          </EmptyContent>
        )}
      </Empty>
    )
  }

return (
  <div className='grid gap-6 md:grid-cols-2'> 
   {
      filteredItems.map((item) => (
        <Card key={item.id} className='group overflow-hidden transition-all hover:shadow-lg pt-0'>
          <Link to="/dashboard/items/$itemId" params={{ itemId: item.id}} className='block '>
          {
            item.ogImage && (
                <div className='aspect-video w-full overflow-hidden bg-muted'>
                  <img src={item.ogImage} alt={item.title ?? 'Saved Item Image'} className='h-full w-full object-cover group-hover:scale-105 transition-transform'/>
                </div>
              )
          }
          <CardHeader className='space-y-3 pt-4'>
            <div className='flex items-center justify-between gap-2'>
              <Badge variant={item.status === 'COMPLETED' ? 'default': 'secondary'}>
                {item.status.toLowerCase()}
              </Badge>
              <Button 
              onClick={async (e) => {
                e.preventDefault()
                await copyToClipboard(item.url)
              

              }}
              
              variant={'outline'} size={'icon'} className='size-8'>
                <CopyIcon className='size-4'/>
              </Button>

            </div>
            <CardTitle className='text-xl leading-snug group-hover:text-primary transition-colors line-clamp-1'>
              {item.title ?? 'No Title Found'}
            </CardTitle>
            {
              item.author ? (
                <p className='text-xs text-muted-foreground'>
                  By {item.author}
                </p>
              ) : <p className='text-xs text-muted-foreground'>
              Author not found
              </p>
            }

          </CardHeader>

          </Link>

        </Card>

      ))
    }
  </div>
)
}


 export  function ItemsGridSkeleton() {
     return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>

            {/* Title */}
            <Skeleton className="h-6 w-full" />

            {/* Author  */}
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}