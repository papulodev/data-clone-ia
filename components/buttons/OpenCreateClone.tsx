import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { CreateCloneForm } from '../forms/CreateCloneForm'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

function OpenCreateClone() {
  return (
    <Dialog>
      <DialogTrigger className='flex bg-primary-container/10 items-center gap-3 px-4 py-3 text-white/40 hover:text-white/80 hover:bg-primary-container/40 transition-colors cursor-pointer p-3.5 w-full rounded-md'>
        <Plus />
        <span>Crear Clon</span>
      </DialogTrigger>
      <DialogContent className='min-w-3xl bg-[#10131c]/80 backdrop-blur-xl border border-[#c5c0ff]/20 shadow-2xl shadow-purple-500/10'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Clon</DialogTitle>
          <DialogDescription>
            Ingresá los datos del cliente para crear su gemelo digital
          </DialogDescription>
        </DialogHeader>
        <CreateCloneForm />
        <DialogFooter className="bg-transparent border-t border-white/5">
          <DialogClose asChild>
            <Button variant="outline" className="border-white/20 hover:bg-white/10">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenCreateClone