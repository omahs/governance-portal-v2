/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Dispatch, SetStateAction, useState } from 'react';
import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import useTransactionStore, {
  transactionsSelectors,
  transactionsApi
} from 'modules/web3/stores/transactions';
import { shallow } from 'zustand/shallow';
import { BigNumber } from 'ethers';
import { Transaction } from 'modules/web3/types/transaction';
import { useContracts } from 'modules/web3/hooks/useContracts';
import { useAccount } from 'modules/app/hooks/useAccount';

type FreeResponse = {
  txId: string | null;
  setTxId: Dispatch<SetStateAction<null>>;
  free: (mkrToWithdraw: BigNumber, callbacks?: Record<string, () => void>) => void;
  tx: Transaction | null;
};

export const useOldChiefFree = (): FreeResponse => {
  const [txId, setTxId] = useState<string | null>(null);

  const { account, voteProxyOldContract } = useAccount();
  const { chiefOld } = useContracts() as MainnetSdk;

  const [track, tx] = useTransactionStore(
    state => [state.track, txId ? transactionsSelectors.getTransaction(state, txId) : null],
    shallow
  );

  const free = (mkrToWithdraw: BigNumber, callbacks?: Record<string, () => void>) => {
    const freeTxCreator = voteProxyOldContract
      ? () => voteProxyOldContract.freeAll()
      : () => chiefOld.free(mkrToWithdraw);

    const transactionId = track(freeTxCreator, account, 'Withdrawing MKR', {
      pending: () => {
        if (typeof callbacks?.pending === 'function') callbacks.pending();
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'MKR withdrawn');
        if (typeof callbacks?.mined === 'function') callbacks.mined();
      },
      error: txId => {
        transactionsApi.getState().setMessage(txId, 'MKR withdraw failed');
        if (typeof callbacks?.error === 'function') callbacks.error();
      }
    });
    setTxId(transactionId);
  };

  return { txId, setTxId, free, tx };
};
