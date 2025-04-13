import { TimerContext } from "@shared/contexts/timerContext"
import { useContext } from "react"

export const useTimer = () => useContext(TimerContext)
