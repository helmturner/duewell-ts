import React, { useContext, useEffect, useState } from 'react';
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from 'react-plaid-link';
import GlobalContext from '../../context/global';
import { Button } from 'grommet';

