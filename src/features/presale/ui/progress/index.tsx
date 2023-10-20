import { text } from 'shared/ui/typogragphy';
import { BodyProgress, HeaderProgress, ProgressWrapper, ProgressContent, list_body } from './ui.module.scss';
import { NAME_BDRIP } from 'shared/config/constants';
import { HARD_CAP_ETH } from 'features/presale/config';
import { ColumnsList } from 'shared/ui/columns';
import { useGetDataPresale, columnsInfo } from '../../model';

export const ProgressSale = () => {
  const { percentProgress, totalEth } = useGetDataPresale();

  return (
    <div className={BodyProgress}>
      <div className={HeaderProgress}>
        <h1 className={text.text_xl}>Total deposit</h1>
        <h1 className={text.text_xl}>
          ETH {totalEth}/{HARD_CAP_ETH}
        </h1>
        <h1 className={text.text_xl}>${NAME_BDRIP}</h1>
      </div>

      <div className={ProgressWrapper}>
        <div className={ProgressContent} style={{ width: `${percentProgress}%` }} />
      </div>

      <div className={list_body}>
        <ColumnsList columns={columnsInfo} />
      </div>
    </div>
  );
};
