import { text } from 'shared/ui/typogragphy';
import {TimerTextBody, TimerTextWrapper } from './ui.module.scss';

interface timerTemplateProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const fromatDate = (date: number) => (date < 10 ? `0${date}` : date);

export const timerTemplate = ({ days, hours, minutes, seconds }: timerTemplateProps) => (
  <div className={TimerTextWrapper}>
    <div className={TimerTextBody}>
      <h3 className={text.text_xl}>{fromatDate(days)}</h3>
      <h4 className={text.text_sm}>Days</h4>
    </div>

    <div className={TimerTextBody}>
      <h3 className={text.text_xl}>{fromatDate(hours)}</h3>
      <h4 className={text.text_sm}>Hours</h4>
    </div>

    <div className={TimerTextBody}>
      <h3 className={text.text_xl}>{fromatDate(minutes)}</h3>
      <h4 className={text.text_sm}>Minutes</h4>
    </div>

    <div className={TimerTextBody}>
      <h3 className={text.text_xl}>{fromatDate(seconds)}</h3>
      <h4 className={text.text_sm}>Seconds</h4>
    </div>
  </div>
);
