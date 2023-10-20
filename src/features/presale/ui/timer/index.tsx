import { text } from 'shared/ui/typogragphy';
import { TimerBody, TimerWrapper } from './ui.module.scss';
import Countdown from 'react-countdown';
import { timerTemplate } from './timer';

interface TimerProps {
  deadline: number;
}

export const Timer = ({ deadline }: TimerProps) => {
  return (
    <div className={TimerBody}>
      <div className={text.text_xl}>Time left:</div>

      <div className={TimerWrapper}>
        {deadline > 0 ? <Countdown date={Date.now() + deadline} renderer={timerTemplate} /> : <p>End presale!</p>}
      </div>
    </div>
  );
};
