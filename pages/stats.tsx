import { DateTime } from 'luxon'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import styled from 'styled-components'
import { Title } from "../components/Text"
import database from '../lib/database'
import { IStats } from "../models"

interface Props {
   stats: IStats
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   await getSession(req)

   return { notFound: true }
}

const Stats: FC<Props> = ({ stats }) => {

   const birth = '1999-07-17'

   return <>
      <Title>Stats</Title>
      <p>You watched <Value>{stats.showsWatched}</Value> shows</p>
      {birth && <Relative birth={birth} {...stats} />}
   </>
}

const Relative: FC<IStats & { birth: string }> = ({ birth, time }) => {

   const { years, minutes, days, totalMinutes } = useMemo(() => {
      const date = DateTime.fromISO(birth)
      const duration = DateTime.now().diff(date, ['minutes', 'days', 'years', 'seconds']).toObject()
      const total = DateTime.now().diff(date, ['minutes', 'seconds'])
      return { ...duration, totalMinutes: total.minutes }
   }, [birth])

   const percentage = useMemo(() => time / totalMinutes * 100, [time, totalMinutes])

   return <>
      <p>Wasted <Increasing>{time}</Increasing> minutes</p>
      <p>Lived for <Increasing>{years}</Increasing> years, <Increasing>{days}</Increasing> days and <Increasing>{minutes}</Increasing> minutes</p>
      <p>That makes a total of <Increasing>{totalMinutes}</Increasing> minutes</p>
      <p><Increasing take={5000} float>{percentage}</Increasing>%</p>
   </>
}

const Increasing: FC<{
   children: number | undefined | null,
   start?: number
   take?: number
   float?: boolean
}> = ({ children, start, take, float }) => {

   const [current, setCurrent] = useState(start ?? 0)

   const move = useCallback((to: number) => {
      const diff = Math.abs(to - current)
      const calls = (take ?? 1000) / 10
      const step = diff / calls

      const interval = setInterval(() =>
         setCurrent(c => {
            if (c < to) return Math.min(to, c + step)
            if (c > to) return Math.max(to, c - step)
            clearInterval(interval)
            return c

         })
      )

      return () => clearInterval(interval)
   }, [setCurrent, take, current])

   useEffect(() => {
      if (children) return move(children);
   }, [children])

   const displayed = useMemo(() => float ? current : Math.round(current), [current, float])

   return <Value>{displayed}</Value>
}

const Value = styled.b`
   color: ${p => p.theme.primary};
`

export default Stats