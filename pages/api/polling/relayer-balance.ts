/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { NextApiRequest, NextApiResponse } from 'next';
import withApiHandler from 'modules/app/api/withApiHandler';
import { isSupportedNetwork } from 'modules/web3/helpers/networks';
import { getMessageFromCode, ERROR_CODES } from 'eth-rpc-errors';
import { getRelayerBalance } from 'modules/polling/api/getRelayerBalance';
import { DEFAULT_NETWORK, SupportedNetworks } from 'modules/web3/constants/networks';
import { ApiError } from 'modules/app/api/ApiError';

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const network = (req.query.network as SupportedNetworks) || DEFAULT_NETWORK.network;

    // validate network
    if (!isSupportedNetwork(network)) {
      throw new ApiError('Invalid network', 400, 'Invalid network');
    }

    const balance = await getRelayerBalance(network);

    return res.status(200).json(balance);
  } catch (err) {
    const errorMessage =
      'code' in err &&
      [...Object.values(ERROR_CODES.provider), ...Object.values(ERROR_CODES.rpc)].includes(err['code'])
        ? getMessageFromCode(err['code'])
        : err.message;

    throw new ApiError(`Relayer balance: ${errorMessage}`, 500, errorMessage);
  }
});
