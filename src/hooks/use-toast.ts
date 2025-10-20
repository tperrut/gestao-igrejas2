import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import { useState, useEffect } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type State = {
  toasts: ToasterToast[]
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  return {
    toast: ({ ...props }: Omit<ToasterToast, "id">) => {
      const id = genId()

      setState((state) => ({
        ...state,
        toasts: [{ id, ...props }, ...state.toasts].slice(0, TOAST_LIMIT),
      }))
    },
    dismiss: (toastId?: string) => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast
        ),
      }))
    },
    toasts: state.toasts,
  }
}