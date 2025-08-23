// src/components/ui/dialog.jsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogOverlay(props) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      className={
        // overlay claro + blur, z-Índice por encima del contenido de la página
        "fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
      }
    />
  )
}

export function DialogContent({ className = "", children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        {...props}
        // centrado absoluto, fondo blanco y contraste alto, sombra marcada
        className={
          "fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 " +
          "w-[min(92vw, 720px)] max-h-[85vh] overflow-auto " +
          "rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xl p-6 " +
          "focus:outline-none " + className
        }
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className = "", ...props }) {
  return <div className={"mb-2 " + className} {...props} />
}

export function DialogTitle({ className = "", ...props }) {
  return (
    <DialogPrimitive.Title
      className={"text-xl font-semibold leading-none tracking-tight " + className}
      {...props}
    />
  )
}

export function DialogDescription({ className = "", ...props }) {
  return (
    <DialogPrimitive.Description
      className={"text-sm text-slate-600 " + className}
      {...props}
    />
  )
}
