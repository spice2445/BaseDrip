import { useCallback, useMemo, useState } from 'react';

import { client } from 'shared/config/blockchain/wagmi';
import { ROUTER_ADDRESS } from 'shared/config/blockchain';
import PAIR_ABI from 'shared/assets/abi/pair.json';
import ROUTER_ABI from 'shared/assets/abi/router.json';
import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';
import { Address } from 'viem';

type SwapAmountsHookResult = {
  amount0: bigint | undefined;
  amount1: bigint | undefined;
  changeInputAmount: (value: bigint | undefined) => void;
  changeOutputAmount: (value: bigint | undefined) => void;
  changePair: (pair: Address | undefined) => void;
  revert: () => void;
  reset: () => void;
  loading: boolean;
  error: Error | undefined;
};

export const useSwapRate = (token0: Address | undefined, token1: Address | undefined): SwapAmountsHookResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [amount0, setAmount0] = useState<bigint>();
  const [amount1, setAmount1] = useState<bigint>();

  const [fee, setFee] = useState<bigint>();

  const fetchAmountsOut = useCallback(
    (value: bigint | undefined) => {
      if (value === undefined) {
        setAmount1(undefined);
        return;
      } else if (value === BigInt(0)) {
        setAmount1(BigInt(0));
        return;
      } else if (!token0 || !token1 || !fee) {
        return;
      }
      setLoading(true);
      client
        .readContract({
          address: ROUTER_ADDRESS,
          abi: ROUTER_ABI,
          functionName: 'getAmountsOut',
          args: [(value * (BigInt(10000) - fee)) / BigInt(10000), [token0, token1]]
        })
        .then((value: any) => setAmount1(BigInt(value[1])))
        .catch((e) => {
          setError(e);
          toast.error(errors.ERROR);
          setAmount1(undefined);
        })
        .finally(() => setLoading(false));
    },
    [fee, token0, token1]
  );

  const fetchAmountsIn = useCallback(
    (value: bigint | undefined) => {
      if (value === undefined) {
        setAmount0(undefined);
        return;
      } else if (value === BigInt(0)) {
        setAmount0(BigInt(0));
        return;
      } else if (!token0 || !token1 || !fee) {
        return;
      }
      setLoading(true);
      client
        .readContract({
          address: ROUTER_ADDRESS,
          abi: ROUTER_ABI,
          functionName: 'getAmountsIn',
          args: [value, [token0, token1]]
        })
        .then((value: any) => setAmount0((BigInt(value[0]) / (BigInt(10000) - fee)) * BigInt(10000)))
        .catch((e) => {
          setError(e);
          toast.error(errors.ERROR);
          setAmount0(undefined);
        })
        .finally(() => setLoading(false));
    },
    [fee, token0, token1]
  );

  const [lastFieldChanged, setLastFieldChanged] = useState<'0' | '1' | undefined>();

  const changePair = useCallback(
    (pair: Address | undefined) => {
      if (!pair) {
        if (lastFieldChanged === '0') {
          setAmount1(undefined);
        } else if (lastFieldChanged === '1') {
          setAmount0(undefined);
        }
        return;
      }
      client
        .readContract({
          address: pair,
          abi: PAIR_ABI,
          functionName: 'fee'
        })
        .then((result: any) => {
          setFee(BigInt(result));
          if (lastFieldChanged === '0') {
            fetchAmountsOut(amount0);
          } else if (lastFieldChanged === '1') {
            fetchAmountsIn(amount1);
          }
        })
        .catch(() => toast.error(errors.ERROR));
    },
    [amount0, amount1, fetchAmountsIn, fetchAmountsOut, lastFieldChanged]
  );

  const changeInputAmount = useCallback(
    async (value: bigint | undefined) => {
      if (!value) return;
      setAmount0(value);
      setLastFieldChanged('0');
      fetchAmountsOut(value);
    },
    [fetchAmountsOut]
  );

  const changeOutputAmount = useCallback(
    async (value: bigint | undefined) => {
      if (!value) return;
      setAmount1(value);
      setLastFieldChanged('1');
      fetchAmountsIn(value);
    },
    [fetchAmountsIn]
  );

  const revert = useCallback(() => {
    setAmount0(amount1);
    setAmount1(amount0);
  }, [amount0, amount1]);

  const reset = useCallback(() => {
    setAmount0(undefined);
    setAmount1(undefined);
  }, []);

  return useMemo(
    () => ({
      amount0,
      amount1,
      changeInputAmount,
      changeOutputAmount,
      loading,
      revert,
      reset,
      error,
      changePair
    }),
    [amount0, amount1, changeInputAmount, changeOutputAmount, loading, reset, revert, error, changePair]
  );
};
