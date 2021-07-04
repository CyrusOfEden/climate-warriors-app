import { useCounter } from "ahooks"

export const useStepForm = (min: number, max: number) => {
  const [step, { inc: nextStep, reset }] = useCounter(min, { min, max })

  return { step, nextStep, reset }
}
