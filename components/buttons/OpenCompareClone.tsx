import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Scale } from 'lucide-react'
import { Clone } from '@/lib/api'
import { CompareClones } from '../CompareClones'

function OpenCompareClone({ clones }: { clones: Clone[] }) {
  return (
    <Dialog>
      <DialogTrigger className='flex bg-primary-container/10 items-center gap-3 px-4 py-3 text-white/40 hover:text-white/80 hover:bg-primary-container/40 transition-colors cursor-pointer p-3.5 w-full rounded-md'>
        <Scale />
        <span className='text-md font-manrope'>Comparar Clones</span>
      </DialogTrigger>
      <DialogContent className='min-w-3xl bg-surface/80 backdrop-blur-xl border border-surface-tint/20 shadow-2xl shadow-purple-500/10'>
        <DialogHeader>
          <DialogTitle>Comparar Clones</DialogTitle>
          <DialogDescription>
            Seleccioná dos clones para comparar sus perfiles
          </DialogDescription>
        </DialogHeader>
        <CompareClones clones={clones} />
        <DialogFooter className="bg-transparent border-t border-white/5">
          <DialogClose asChild>
            <Button variant="outline" className="border-white/20 hover:bg-white/10">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenCompareClone