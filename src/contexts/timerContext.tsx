import { TimerInfo } from "@shared/utils/types"
import { safeJsonParse } from "@shared/utils/utils"
import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
  FC,
} from "react"

type Props = { children: ReactNode }

type TimerContext = {
  timerInfo: TimerInfo | null
  clearTimer: () => void
  updateTimer: (info: TimerInfo) => void
}

const initialTimer = {
  timerInfo: null,
  clearTimer: () => {},
  updateTimer: (info: TimerInfo) => {},
}

export const TimerContext = createContext<TimerContext>(initialTimer)

export const TimerContextProvider: FC<Props> = ({ children }) => {
  const [timerInfo, setTimerInfo] = useState<TimerInfo | null>(() =>
    safeJsonParse(localStorage.getItem("timerInfo")),
  )

  const clearTimer = useCallback(() => {
    setTimerInfo(null)
    localStorage.removeItem("timerInfo")
  }, [])

  const updateTimer = useCallback((info: TimerInfo) => {
    setTimerInfo(info)
    localStorage.setItem("timerInfo", JSON.stringify(info))
  }, [])

  const value: TimerContext = { timerInfo, clearTimer, updateTimer }

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}
