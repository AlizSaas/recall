import { MessageResponse } from '@/components/ai-elements/message'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {getItemById, saveSummaryAndGenerateTagsFn } from '@/data/items'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { ArrowLeft, Calendar, ChevronDown, Clock, ExternalLink, Loader2Icon, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'


  export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader:({params}) => getItemById({data:{id:params.itemId}}),
  head:({loaderData}) => ({
    meta:[
      {title: loaderData?.title ?? 'Item Details'},
      {
        property:'og:image',
        content: loaderData?.ogImage ?? '',
      },
      {
        name:'twitter:title',
        content: loaderData?.title ?? '',
      }
    ]
    
  })
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const [contentOpen,setContentOpen] = useState(false)
  const router = useRouter()
  const {completion,isLoading,complete} = useCompletion({
    api: '/api/ai/summary',
    streamProtocol:'text',
    initialCompletion: data.summary ? data.summary : undefined,
    body:{
      itemId: data.id,
    }, onFinish: async (_prompt,completionText) => {
      await saveSummaryAndGenerateTagsFn({
        data:{
          id: data.id,
          summary: completionText
        }
      })
      toast.success('Summary generated successfully!')
      router.invalidate()
      
      
    },
    onError:(err) => {
      toast.error('Error generating summary: ' + err.message)

    },
   
  }) // for future use

  function handleGenerateSummary() {
    if(!data.content)  {
      toast.error('No content available to summarize.')
      return 
    }

    complete(data.content)

  }
  return (
    <div className='mx-auto max-w-3xl space-y-6 w-full'>
     <div className='flex items-start space-y-3'>
         <Link to="/dashboard/items" className={buttonVariants({variant:'outline',})} >
        <ArrowLeft/>
        Go Back
        </Link>
     </div>
     {data.ogImage && (
      <div className='relative aspect-video w-full overflow-hidden rounded-lg bg-muted'>
        <img src={data.ogImage} alt={data.title ?? 'Item Image'} 
        className='h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105' />

      </div>
     )}
     <div className='space-y-4'>
      <h1 className='text-3xl font-bold tracking-tight'>
        {data.title ?? 'No Title Found'}
      </h1>

      <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>

        {
          data.author && (
            <span className='flex items-center gap-1'>
              <User className=' size-4 mr-1'/>
              By {data.author}
            </span>
          )
        }
        {
          data.publishedAt && (
            <span className='flex items-center gap-1'>
              <Calendar className=' size-4 '/>
              Published on {new Date(data.publishedAt).toLocaleDateString()}
            </span>
          )
        }
         <span className='flex items-center gap-1'>
              <Clock className=' size-4 '/>
             Saved  {new Date(data.createdAt).toLocaleDateString()}
            </span>



      </div>
      <a href={data.url} target='_blank' className='text-primary gap-1 hover:underline inline-flex items-center font-medium'>
        View Original Article
        <ExternalLink className=' size-4 '/>


      </a>
      {
        data.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
         {
            data.tags.map((tag) => (
              <Badge key={tag} className=''>
                {tag}
              </Badge>
            ))
         }

            </div>
        )
      }

      {/* summary*/}
<Card className='border-primary/20 bg-primary/5'>
<CardContent>
  <div className='flex items-start justify-between gap-4'>
    <div className='flex-1'>
      <h2 className='text-sm font-semibold uppercase tracking-wide text-primary'>
        Summary
      </h2>
      {
        completion ||  data.summary ? (
          <MessageResponse>
            {completion}
          </MessageResponse>
        ):(
          <p className='text-muted-foreground italic'>
           {
            data.content ? 'No summary available. You can generate one using the AI summary feature.' : 'No content available to summarize.'
           }
          </p>
        )
      }

    </div>
    {
      data.content &&  !data.summary && ( // only show button if no existing summary
        <Button disabled={isLoading}size={'sm'} onClick={handleGenerateSummary}>
          {
            isLoading ? (
              <>
              <Loader2Icon className='size-4 animate-spin mr-2 '/>
              Generating...
              </>
            ): (
              <>
              <Sparkles className=' size-4 mr-2 '/>
              Generate Summary
              </>
            )
          }

        </Button>
      ) 
    }

  </div>
</CardContent>


</Card>

{/* content*/}
{
  data.content && (
    <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
    <CollapsibleTrigger asChild>
    <Button variant={'outline'} className='w-full justify-between'>
      <span className='font-medium'>
        Read Full Content
      </span>
      <ChevronDown className={cn(
        contentOpen ? 'rotate-180' : 'size-4 transition-transform duration-200',
      )}/>
      </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
      <Card>
        <CardContent>
          <MessageResponse>
            {data.content}
          </MessageResponse>
        </CardContent>
      </Card>
      
      </CollapsibleContent>
    </Collapsible>
  )
}
     </div>

     

    </div>
  )
}
